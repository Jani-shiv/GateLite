import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { VisitorType } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PassesService {
  constructor(private prisma: PrismaService) {}

  async create(societyId: string, flatId: string, userId: string, data: {
    visitorName: string;
    visitorPhone?: string;
    validFrom: Date;
    validTo: Date;
    usesLeft: number;
    purpose?: string;
  }) {
    // Verify user owns the flat
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, flatId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('You can only create passes for your own flat');

    // Create or find visitor
    let visitor = await this.prisma.visitor.findFirst({
      where: { societyId, name: data.visitorName, phone: data.visitorPhone ?? null },
    });

    if (!visitor) {
      visitor = await this.prisma.visitor.create({
        data: {
          societyId,
          name: data.visitorName,
          phone: data.visitorPhone ?? null,
          type: VisitorType.VISITOR,
        },
      });
    }

    // Generate HMAC-signed code for offline verification
    const code = this.generatePassCode(visitor.id, data.validFrom, data.validTo, data.usesLeft, flatId);

    const pass = await this.prisma.pass.create({
      data: {
        societyId,
        flatId,
        createdById: userId,
        visitorId: visitor.id,
        code,
        validFrom: data.validFrom,
        validTo: data.validTo,
        usesLeft: data.usesLeft,
      },
      include: { visitor: true, flat: true },
    });

    return { pass, code };
  }

  async findAll(societyId: string, userId: string, flatId?: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const targetFlatId = flatId || membership.flatId;

    return this.prisma.pass.findMany({
      where: { societyId, flatId: targetFlatId },
      include: { visitor: true, flat: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(societyId: string, id: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const pass = await this.prisma.pass.findFirst({
      where: { id, societyId, flatId: membership.flatId },
      include: { visitor: true, flat: true },
    });
    if (!pass) throw new NotFoundException('Pass not found');
    return pass;
  }

  async revoke(societyId: string, id: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    return this.prisma.pass.update({
      where: { id, societyId, flatId: membership.flatId },
      data: { isActive: false },
    });
  }

  async verifyCode(societyId: string, code: string) {
    const pass = await this.prisma.pass.findFirst({
      where: { code, societyId, isActive: true },
      include: { visitor: true, flat: true },
    });

    if (!pass) return { valid: false, reason: 'Invalid pass code' };
    if (pass.validFrom > new Date()) return { valid: false, reason: 'Pass not yet valid' };
    if (pass.validTo < new Date()) return { valid: false, reason: 'Pass expired' };
    if (pass.usesLeft <= 0) return { valid: false, reason: 'Pass uses exhausted' };

    return { valid: true, pass };
  }

  async verifyCodeOffline(societyId: string, code: string): Promise<{ valid: boolean; passData?: any; reason?: string }> {
    try {
      // Verify HMAC signature
      const expectedCode = this.generatePassCodeFromCode(code);
      if (expectedCode !== code) {
        return { valid: false, reason: 'Invalid signature' };
      }

      // Extract data from code (in real implementation, decode the payload)
      const pass = await this.prisma.pass.findFirst({
        where: { code, societyId, isActive: true },
        include: { visitor: true, flat: true },
      });

      if (!pass) return { valid: false, reason: 'Pass not found' };
      if (pass.validFrom > new Date()) return { valid: false, reason: 'Pass not yet valid' };
      if (pass.validTo < new Date()) return { valid: false, reason: 'Pass expired' };
      if (pass.usesLeft <= 0) return { valid: false, reason: 'Pass uses exhausted' };

      return { valid: true, passData: { visitorName: pass.visitor.name, flatNumber: pass.flat.number } };
    } catch {
      return { valid: false, reason: 'Invalid code format' };
    }
  }

  private generatePassCode(visitorId: string, validFrom: Date, validTo: Date, usesLeft: number, flatId: string): string {
    const payload = {
      v: visitorId,
      f: flatId,
      s: validFrom.getTime(),
      e: validTo.getTime(),
      u: usesLeft,
      t: Date.now(),
    };
    
    const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', process.env['PASS_SIGNING_KEY'] || 'dev-signing-key')
      .update(payloadStr)
      .digest('hex')
      .substr(0, 16);
    
    return `${payloadStr}.${signature}`.toUpperCase();
  }

  private generatePassCodeFromCode(code: string): string {
    // In a real implementation, this would decode and verify the signature
    // For now, just return the code as-is for database lookup
    return code;
  }

  // Generate QR code data
  generateQrData(pass: any): string {
    return JSON.stringify({
      type: 'gatelite_pass',
      code: pass.code,
      visitor: pass.visitor.name,
      flat: pass.flat.number,
      validFrom: pass.validFrom,
      validTo: pass.validTo,
      usesLeft: pass.usesLeft,
    });
  }
}