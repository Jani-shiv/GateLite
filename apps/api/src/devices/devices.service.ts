import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async registerDevice(userId: string, deviceId: string, societyId?: string): Promise<void> {
    await this.prisma.device.upsert({
      where: {
        userId_fcmToken: {
          userId,
          fcmToken: deviceId,
        },
      },
      update: {
        lastSeen: new Date(),
        ...(societyId && { societyId }),
      },
      create: {
        userId,
        fcmToken: deviceId,
        platform: 'unknown',
        societyId: societyId || '',
      },
    });
  }

  async updateDeviceToken(userId: string, oldDeviceId: string, newDeviceId: string): Promise<void> {
    await this.prisma.device.update({
      where: {
        userId_fcmToken: {
          userId,
          fcmToken: oldDeviceId,
        },
      },
      data: {
        fcmToken: newDeviceId,
        lastSeen: new Date(),
      },
    });
  }

  async removeDevice(userId: string, deviceId: string): Promise<void> {
    await this.prisma.device.delete({
      where: {
        userId_fcmToken: {
          userId,
          fcmToken: deviceId,
        },
      },
    });
  }

  async getUserDevices(userId: string) {
    return this.prisma.device.findMany({
      where: { userId },
      orderBy: { lastSeen: 'desc' },
    });
  }

  async getSocietyDevices(societyId: string) {
    return this.prisma.device.findMany({
      where: { societyId },
      include: { user: { select: { id: true, name: true, phone: true } } },
      orderBy: { lastSeen: 'desc' },
    });
  }
}