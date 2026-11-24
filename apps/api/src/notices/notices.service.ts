import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PUSH_PROVIDER } from '../common/tokens';
import type { PushPayload } from '../common/interfaces/otp-provider.interface';

@Injectable()
export class NoticesService {
  constructor(
    private prisma: PrismaService,
    @Inject('PUSH_PROVIDER') private pushProvider: any,
  ) {}

  async create(societyId: string, userId: string, data: {
    title: string;
    body: string;
    pinned?: boolean;
    publishAt?: Date | null;
  }) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, role: 'ADMIN', status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Only admins can create notices');

    const notice = await this.prisma.notice.create({
      data: {
        societyId,
        title: data.title,
        body: data.body,
        pinned: data.pinned ?? false,
        publishedAt: data.publishAt ?? null,
        createdById: userId,
      },
    });

    // If published immediately, send notifications
    if (!data.publishAt || data.publishAt <= new Date()) {
      await this.sendNotifications(notice);
    }

    return notice;
  }

  async findAll(societyId: string, userId: string, params: { page?: number | undefined; limit?: number | undefined; published?: boolean | undefined } = {}) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { societyId };
    if (params.published !== undefined) {
      where.publishedAt = params.published ? { not: null, lte: new Date() } : null;
    }

    const [notices, total] = await Promise.all([
      this.prisma.notice.findMany({
        where,
        include: { createdBy: { select: { id: true, name: true } } },
        orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.notice.count({ where }),
    ]);

    return { notices, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(societyId: string, id: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const notice = await this.prisma.notice.findFirst({
      where: { id, societyId },
      include: { createdBy: { select: { id: true, name: true } } },
    });
    if (!notice) throw new NotFoundException('Notice not found');
    return notice;
  }

  async update(societyId: string, id: string, userId: string, data: {
    title?: string;
    body?: string;
    pinned?: boolean;
    publishAt?: Date | null;
  }) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, role: 'ADMIN', status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Only admins can update notices');

    const notice = await this.prisma.notice.findFirst({ where: { id, societyId } });
    if (!notice) throw new NotFoundException('Notice not found');

    const wasPublished = !!notice.publishedAt;
    const willPublish = data.publishAt !== undefined ? (data.publishAt ? data.publishAt <= new Date() : false) : wasPublished;

    const { publishAt, ...restData } = data;
    const updated = await this.prisma.notice.update({
      where: { id },
      data: {
        ...restData,
        publishedAt: publishAt ?? null,
      },
    });

    // Send notifications if newly published
    if (!wasPublished && willPublish) {
      await this.sendNotifications(updated);
    }

    return updated;
  }

  async delete(societyId: string, id: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, role: 'ADMIN', status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Only admins can delete notices');

    return this.prisma.notice.delete({ where: { id, societyId } });
  }

  async markAsRead(societyId: string, id: string, userId: string) {
    // In a real implementation, track read receipts
    return { success: true };
  }

  private async sendNotifications(notice: any) {
    const memberships = await this.prisma.membership.findMany({
      where: { societyId: notice.societyId, status: 'ACTIVE' },
      include: { user: { include: { devices: true } } },
    });

    const payload: PushPayload = {
      title: notice.title,
      body: notice.body.length > 100 ? notice.body.substring(0, 100) + '...' : notice.body,
      data: { noticeId: notice.id, type: 'notice' },
    };

    for (const membership of memberships) {
      for (const device of membership.user.devices) {
        await this.pushProvider.sendPush(device.fcmToken, payload);
      }
    }
  }
}