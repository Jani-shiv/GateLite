import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class FlatsService {
  constructor(private prisma: PrismaService) {}

  async create(societyId: string, userId: string, data: { blockId: string; number: string; floor: number }) {
    await this.verifyAdmin(societyId, userId);
    
    const existing = await this.prisma.flat.findUnique({
      where: { societyId_blockId_number: { societyId, blockId: data.blockId, number: data.number } },
    });
    if (existing) throw new ConflictException('Flat already exists in this block');

    return this.prisma.flat.create({
      data: { societyId, ...data },
    });
  }

  async bulkCreate(societyId: string, userId: string, flats: Array<{ blockId: string; number: string; floor: number }>) {
    await this.verifyAdmin(societyId, userId);
    
    const results = await this.prisma.$transaction(
      flats.map((flat) =>
        this.prisma.flat.create({
          data: { societyId, ...flat },
        }),
      ),
    );
    
    return results;
  }

  async importFromCsv(societyId: string, userId: string, csvData: string) {
    await this.verifyAdmin(societyId, userId);
    
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const flats = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((h, i) => obj[h] = values[i]);
      return {
        blockId: obj.blockId,
        number: obj.number,
        floor: parseInt(obj.floor),
      };
    });

    return this.bulkCreate(societyId, userId, flats);
  }

  async findAll(societyId: string, userId: string, blockId?: string) {
    await this.verifyMember(societyId, userId);
    return this.prisma.flat.findMany({
      where: { societyId, ...(blockId && { blockId }) },
      include: { block: true, _count: { select: { memberships: true } } },
      orderBy: [{ block: { name: 'asc' } }, { number: 'asc' }],
    });
  }

  async findOne(societyId: string, id: string, userId: string) {
    await this.verifyMember(societyId, userId);
    const flat = await this.prisma.flat.findFirst({
      where: { id, societyId },
      include: { block: true, memberships: { include: { user: true } } },
    });
    if (!flat) throw new NotFoundException('Flat not found');
    return flat;
  }

  async update(societyId: string, id: string, userId: string, data: { number?: string; floor?: number }) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.flat.update({
      where: { id },
      data,
    });
  }

  async delete(societyId: string, id: string, userId: string) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.flat.delete({ where: { id } });
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