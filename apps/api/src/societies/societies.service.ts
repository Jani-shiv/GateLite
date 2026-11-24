import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class SocietiesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    adminId: string;
  }) {
    const society = await this.prisma.society.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        plan: 'starter',
        settings: {},
      },
    });

    // Create admin membership
    await this.prisma.membership.create({
      data: {
        userId: data.adminId,
        societyId: society.id,
        flatId: '', // Will be set when flat is created
        role: 'ADMIN',
        isOwner: true,
        status: 'ACTIVE',
      },
    });

    return society;
  }

  async findAll(userId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        society: true,
        flat: true,
      },
    });

    return memberships.map((m) => ({
      ...m.society,
      userRole: m.role,
      userFlat: m.flat,
    }));
  }

  async findOne(id: string, userId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId_flatId: {
          userId,
          societyId: id,
          flatId: '', // This needs to be fixed - we need to get the user's flat
        },
      },
      include: { society: true, flat: true },
    });

    if (!membership) {
      throw new NotFoundException('Society not found or access denied');
    }

    return {
      ...membership.society,
      userRole: membership.role,
      userFlat: membership.flat,
    };
  }

  async update(id: string, userId: string, data: Partial<{
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    settings: Record<string, any>;
  }>) {
    // Check admin permission
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId: id, role: 'ADMIN', status: 'ACTIVE' },
    });

    if (!membership) {
      throw new ForbiddenException('Only admins can update society settings');
    }

    return this.prisma.society.update({
      where: { id },
      data,
    });
  }

  async getSettings(id: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId: id, status: 'ACTIVE' },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied');
    }

    const society = await this.prisma.society.findUnique({
      where: { id },
      select: { settings: true, plan: true },
    });

    return society?.settings || {};
  }

  async updateSettings(id: string, userId: string, settings: Record<string, any>) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId: id, role: 'ADMIN', status: 'ACTIVE' },
    });

    if (!membership) {
      throw new ForbiddenException('Only admins can update society settings');
    }

    return this.prisma.society.update({
      where: { id },
      data: { settings },
    });
  }
}