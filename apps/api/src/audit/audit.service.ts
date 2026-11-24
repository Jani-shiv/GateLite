import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { MembershipRole } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(societyId: string, data: {
    actorId: string;
    action: string;
    entity: string;
    entityId?: string;
    ip?: string;
    userAgent?: string;
  }) {
    return this.prisma.auditLog.create({
      data: { societyId, ...data },
    });
  }

  async findAll(societyId: string, userId: string, params: {
    page?: number | undefined;
    limit?: number | undefined;
    actorId?: string | undefined;
    action?: string | undefined;
    entity?: string | undefined;
    entityId?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
  } = {}) {
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === MembershipRole.ADMIN;
    if (!isAdmin) throw new ForbiddenException('Admin access required');

    const page = params.page || 1;
    const limit = Math.min(params.limit || 50, 200);
    const skip = (page - 1) * limit;

    const where: any = { societyId };
    if (params.actorId) where.actorId = params.actorId;
    if (params.action) where.action = { contains: params.action, mode: 'insensitive' };
    if (params.entity) where.entity = params.entity;
    if (params.entityId) where.entityId = params.entityId;
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getActions() {
    return this.prisma.auditLog.groupBy({ by: ['action'], _count: true, orderBy: { _count: { action: 'desc' } } });
  }

  async getEntities() {
    return this.prisma.auditLog.groupBy({ by: ['entity'], _count: true, orderBy: { _count: { entity: 'desc' } } });
  }
}