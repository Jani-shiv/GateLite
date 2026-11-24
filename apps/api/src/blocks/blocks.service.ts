import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class BlocksService {
  constructor(private prisma: PrismaService) {}

  async create(societyId: string, userId: string, name: string) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.block.create({
      data: { societyId, name },
    });
  }

  async findAll(societyId: string, userId: string) {
    await this.verifyMember(societyId, userId);
    return this.prisma.block.findMany({
      where: { societyId },
      include: { _count: { select: { flats: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(societyId: string, id: string, userId: string) {
    await this.verifyMember(societyId, userId);
    const block = await this.prisma.block.findFirst({
      where: { id, societyId },
      include: { flats: { orderBy: { number: 'asc' } } },
    });
    if (!block) throw new NotFoundException('Block not found');
    return block;
  }

  async update(societyId: string, id: string, userId: string, name: string) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.block.update({
      where: { id },
      data: { name },
    });
  }

  async delete(societyId: string, id: string, userId: string) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.block.delete({ where: { id } });
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