import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { MembershipRole, MembershipStatus, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async inviteResident(societyId: string, userId: string, data: {
    flatId: string;
    phone: string;
    name: string;
    role?: MembershipRole;
    isOwner?: boolean;
  }) {
    await this.verifyAdmin(societyId, userId);

    // Verify flat belongs to society
    const flat = await this.prisma.flat.findFirst({
      where: { id: data.flatId, societyId },
    });
    if (!flat) throw new NotFoundException('Flat not found in this society');

    // Check if user already exists
    let user = await this.prisma.user.findUnique({ where: { phone: data.phone } });
    
    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          phone: data.phone,
          name: data.name,
          status: UserStatus.ACTIVE,
        },
      });
    }

    // Check if membership already exists
    const existingMembership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId_flatId: {
          userId: user.id,
          societyId,
          flatId: data.flatId,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException('Resident already exists for this flat');
    }

    // Create membership
    return this.prisma.membership.create({
      data: {
        userId: user.id,
        societyId,
        flatId: data.flatId,
        role: data.role || MembershipRole.OWNER,
        isOwner: data.isOwner ?? false,
        status: MembershipStatus.ACTIVE,
      },
      include: { user: true, flat: true },
    });
  }

  async acceptInvite(userId: string, societyId: string, flatId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId_flatId: { userId, societyId, flatId },
      },
    });

    if (!membership) throw new NotFoundException('Invitation not found');

    return this.prisma.membership.update({
      where: { id: membership.id },
      data: { status: MembershipStatus.ACTIVE },
    });
  }

  async findAll(societyId: string, userId: string, params: {
    page?: number;
    limit?: number;
    flatId?: string;
    role?: string;
    status?: string;
  } = {}) {
    await this.verifyMember(societyId, userId);

    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === 'ADMIN';
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { societyId };
    if (!isAdmin) where.flatId = membership.flatId;
    else if (params.flatId) where.flatId = params.flatId;
    if (params.role) where.role = params.role;
    if (params.status) where.status = params.status;

    const [residents, total] = await Promise.all([
      this.prisma.membership.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, phone: true, avatarUrl: true, status: true } },
          flat: { select: { id: true, number: true, block: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.membership.count({ where }),
    ]);

    return { residents, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(societyId: string, id: string, userId: string) {
    await this.verifyMember(societyId, userId);

    const membership = await this.prisma.membership.findFirst({
      where: { id, societyId },
      include: {
        user: { select: { id: true, name: true, phone: true, avatarUrl: true, status: true } },
        flat: { select: { id: true, number: true, block: { select: { name: true } } } },
      },
    });
    if (!membership) throw new NotFoundException('Resident not found');
    return membership;
  }

  async update(societyId: string, id: string, userId: string, data: {
    role?: MembershipRole | undefined;
    status?: MembershipStatus | undefined;
    isOwner?: boolean | undefined;
  }) {
    await this.verifyAdmin(societyId, userId);
    const updateData: any = { ...data };
    if (data.role !== undefined) updateData.role = data.role;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isOwner !== undefined) updateData.isOwner = data.isOwner;
    return this.prisma.membership.update({
      where: { id, societyId },
      data: updateData,
      include: { user: true, flat: true },
    });
  }

  async remove(societyId: string, id: string, userId: string) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.membership.delete({ where: { id, societyId } });
  }

  async importFromCsv(societyId: string, userId: string, csvData: string) {
    await this.verifyAdmin(societyId, userId);

    const lines = csvData.trim().split('\n');
    if (lines.length === 0) return { imported: 0, errors: [], residents: [] };

    const firstLine = lines[0];
    if (!firstLine) return { imported: 0, errors: [], residents: [] };
    const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['flatid', 'phone', 'name'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new BadRequestException(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const results = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const lineTrimmed = line.trim();
      if (!lineTrimmed) continue;

      const values = lineTrimmed.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((h, idx) => obj[h] = values[idx] || '');

      try {
        const flatId = obj.flatid;
        const phone = obj.phone;
        const name = obj.name;
        const role = obj.role || 'OWNER';

        if (!flatId || !phone || !name) {
          errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        // Verify flat exists
        const flat = await this.prisma.flat.findFirst({
          where: { id: flatId, societyId },
        });
        if (!flat) {
          errors.push(`Row ${i + 1}: Flat ${flatId} not found`);
          continue;
        }

        // Check if resident already exists
        const existingMembership = await this.prisma.membership.findFirst({
          where: { societyId, flatId },
        });
        if (existingMembership) {
          errors.push(`Row ${i + 1}: Resident already exists for flat ${flatId}`);
          continue;
        }

        // Find or create user
        let user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user) {
          user = await this.prisma.user.create({
            data: { phone, name, status: 'ACTIVE' },
          });
        }

        // Create membership
        const membership = await this.prisma.membership.create({
          data: {
            userId: user.id,
            societyId,
            flatId,
            role: role as any,
            isOwner: true,
            status: 'ACTIVE',
          },
          include: { user: true, flat: true },
        });

        results.push(membership);
      } catch (error) {
        const err = error as Error;
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    return { imported: results.length, errors, residents: results };
  }

  private async verifyAdmin(societyId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, role: 'ADMIN', status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Admin access required');
  }

  private async verifyMember(societyId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');
  }
}