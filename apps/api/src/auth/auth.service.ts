import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../common/prisma/prisma.service';
import { OTP_PROVIDER } from '../common/tokens';
import { DevicesService } from '../devices/devices.service';

interface TokenPayload {
  sub: string;
  phone: string;
  societyId?: string;
  flatId?: string;
  role?: string;
  deviceId: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class AuthService {
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = '30d';
  private readonly otpLength = 6;
  private readonly otpExpiryMinutes = 10;
  private readonly maxOtpAttempts = 3;
  private readonly otpRateLimitWindowMs = 10 * 60 * 1000; // 10 minutes

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('OTP_PROVIDER') private otpProvider: any,
    private devicesService: DevicesService,
  ) {}

  async sendOtp(phone: string, deviceId: string): Promise<void> {
    // Rate limiting: check recent OTP requests
    const recentRequests = await this.prisma.otpRequest.count({
      where: {
        phone,
        createdAt: {
          gte: new Date(Date.now() - this.otpRateLimitWindowMs),
        },
      },
    });

    if (recentRequests >= this.maxOtpAttempts) {
      throw new BadRequestException('Too many OTP requests. Please try again later.');
    }

    // Generate OTP
    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000);

    // Store OTP request
    await this.prisma.otpRequest.create({
      data: {
        phone,
        code,
        expiresAt,
        deviceId,
      },
    });

    // Send OTP via provider
    await this.otpProvider.send(phone, code);
  }

  async verifyOtp(phone: string, code: string, deviceId: string): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    // Find valid OTP request
    const otpRequest = await this.prisma.otpRequest.findFirst({
      where: {
        phone,
        code,
        expiresAt: { gte: new Date() },
        consumed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRequest) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as consumed
    await this.prisma.otpRequest.update({
      where: { id: otpRequest.id },
      data: { consumed: true },
    });

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone } });
    
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          name: `User ${phone.slice(-4)}`,
          status: 'ACTIVE',
        },
      });
    }

    // Get user's active membership (for society context)
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
      include: {
        society: true,
        flat: true,
      },
    });

    // Register/update device
    await this.devicesService.registerDevice(user.id, deviceId, membership?.societyId);

    // Generate tokens
    const tokens = await this.generateTokens(user, membership, deviceId);

    return {
      ...tokens,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatarUrl: user.avatarUrl,
        membership: membership ? {
          societyId: membership.societyId,
          societyName: membership.society.name,
          flatId: membership.flatId,
          flatNumber: membership.flat.number,
          role: membership.role,
        } : null,
      },
    };
  }

  async refreshTokens(refreshToken: string, deviceId: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET')!,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Check if refresh token is valid and not reused
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        // Token reuse detected - revoke all tokens for this user/device
        await this.revokeAllUserTokens(payload.sub, deviceId);
        throw new UnauthorizedException('Token reuse detected. Please log in again.');
      }

      // Revoke the used refresh token
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });

      // Get current user and membership
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User not found or inactive');
      }

      const membership = await this.prisma.membership.findFirst({
        where: {
          userId: user.id,
          status: 'ACTIVE',
        },
        include: { society: true, flat: true },
      });

      // Generate new tokens
      return this.generateTokens(user, membership, deviceId);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeTokens(userId: string, deviceId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        deviceId,
        revoked: false,
      },
      data: { revoked: true },
    });
  }

  async revokeAllUserTokens(userId: string, deviceId?: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        ...(deviceId ? { deviceId } : {}),
        revoked: false,
      },
      data: { revoked: true },
    });
  }

  private async generateTokens(user: any, membership: any, deviceId: string) {
    const payload: Omit<TokenPayload, 'type'> = {
      sub: user.id,
      phone: user.phone,
      societyId: membership?.societyId,
      flatId: membership?.flatId,
      role: membership?.role,
      deviceId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET')!,
      expiresIn: this.accessTokenExpiry,
    });

    const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, {
      secret: this.configService.get('JWT_REFRESH_SECRET')!,
      expiresIn: this.refreshTokenExpiry,
    });

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        deviceId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return { accessToken, refreshToken };
  }

  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Cleanup expired OTP requests and refresh tokens
  async cleanupExpiredTokens(): Promise<void> {
    await this.prisma.otpRequest.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}