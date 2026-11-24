import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { TicketCategory, TicketStatus, TicketPriority, MembershipRole } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(societyId: string, userId: string, data: {
    flatId?: string;
    category: TicketCategory;
    priority: TicketPriority;
    title: string;
    description: string;
  }) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const flatId = data.flatId || membership.flatId;

    return this.prisma.ticket.create({
      data: {
        societyId,
        flatId,
        reporterId: userId,
        category: data.category,
        priority: data.priority,
        title: data.title,
        description: data.description,
      },
    });
  }

  async findAll(societyId: string, userId: string, params: {
    page?: number | undefined;
    limit?: number | undefined;
    status?: TicketStatus | undefined;
    category?: TicketCategory | undefined;
    priority?: TicketPriority | undefined;
    flatId?: string | undefined;
  } = {}) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === MembershipRole.ADMIN;
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { societyId };
    
    if (!isAdmin) {
      where.flatId = membership.flatId;
    } else if (params.flatId) {
      where.flatId = params.flatId;
    }
    
    if (params.status) where.status = params.status;
    if (params.category) where.category = params.category;
    if (params.priority) where.priority = params.priority;

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        include: {
          flat: true,
          reporter: { select: { id: true, name: true, phone: true } },
          assignee: { select: { id: true, name: true } },
          _count: { select: { comments: true } },
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return { tickets, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(societyId: string, id: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === MembershipRole.ADMIN;

    const ticket = await this.prisma.ticket.findFirst({
      where: { id, societyId, ...(!isAdmin && { flatId: membership.flatId }) },
      include: {
        flat: true,
        reporter: { select: { id: true, name: true, phone: true } },
        assignee: { select: { id: true, name: true } },
        comments: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async update(societyId: string, id: string, userId: string, data: {
    status?: TicketStatus;
    priority?: TicketPriority;
    assigneeId?: string;
  }) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === MembershipRole.ADMIN;
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, societyId, ...(!isAdmin && { flatId: membership.flatId }) },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');

    // Only admins can assign or change priority
    if (!isAdmin && (data.assigneeId || data.priority)) {
      throw new ForbiddenException('Only admins can assign tickets or change priority');
    }

    const updateData: any = {};
    if (data.status) {
      updateData.status = data.status;
      if (data.status === TicketStatus.RESOLVED || data.status === TicketStatus.CLOSED) {
        updateData.resolvedAt = new Date();
      }
    }
    if (data.priority) updateData.priority = data.priority;
    if (data.assigneeId) updateData.assigneeId = data.assigneeId;

    return this.prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        flat: true,
        reporter: { select: { id: true, name: true, phone: true } },
        assignee: { select: { id: true, name: true } },
      },
    });
  }

  async addComment(societyId: string, id: string, userId: string, body: string, isInternal = false) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === MembershipRole.ADMIN;
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, societyId, ...(!isAdmin && { flatId: membership.flatId }) },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');

    // Only admins can add internal comments
    if (isInternal && !isAdmin) {
      throw new ForbiddenException('Only admins can add internal comments');
    }

    return this.prisma.ticketComment.create({
      data: {
        ticketId: id,
        userId,
        body,
        isInternal,
      },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async getCategories() {
    return Object.values(TicketCategory);
  }

  async getStats(societyId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === MembershipRole.ADMIN;
    const where = { societyId, ...(!isAdmin && { flatId: membership.flatId }) };

    const [byStatus, byCategory, byPriority] = await Promise.all([
      this.prisma.ticket.groupBy({ by: ['status'], where, _count: true }),
      this.prisma.ticket.groupBy({ by: ['category'], where, _count: true }),
      this.prisma.ticket.groupBy({ by: ['priority'], where, _count: true }),
    ]);

    return { byStatus, byCategory, byPriority };
  }
}