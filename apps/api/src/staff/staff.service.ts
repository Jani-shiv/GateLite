import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(societyId: string, userId: string, data: { name: string; role: string }) {
    await this.verifyAdmin(societyId, userId);
    
    const qrCode = crypto.randomBytes(16).toString('hex');
    
    return this.prisma.staff.create({
      data: {
        societyId,
        name: data.name,
        role: data.role,
        qrCode,
      },
    });
  }

  async findAll(societyId: string, userId: string) {
    await this.verifyMember(societyId, userId);
    return this.prisma.staff.findMany({
      where: { societyId },
      include: { _count: { select: { attendance: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(societyId: string, id: string, userId: string) {
    await this.verifyMember(societyId, userId);
    const staff = await this.prisma.staff.findFirst({
      where: { id, societyId },
      include: { attendance: { orderBy: { inAt: 'desc' }, take: 10 } },
    });
    if (!staff) throw new NotFoundException('Staff not found');
    return staff;
  }

  async update(societyId: string, id: string, userId: string, data: { name?: string; role?: string }) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.staff.update({
      where: { id },
      data,
    });
  }

  async delete(societyId: string, id: string, userId: string) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.staff.delete({ where: { id } });
  }

  async checkIn(societyId: string, staffId: string, flatId: string) {
    const staff = await this.prisma.staff.findFirst({ where: { id: staffId, societyId } });
    if (!staff) throw new NotFoundException('Staff not found');

    return this.prisma.staffAttendance.create({
      data: { staffId, flatId, inAt: new Date() },
    });
  }

  async checkOut(societyId: string, attendanceId: string) {
    const attendance = await this.prisma.staffAttendance.findFirst({
      where: { id: attendanceId, staff: { societyId } },
    });
    if (!attendance) throw new NotFoundException('Attendance record not found');
    if (attendance.outAt) throw new BadRequestException('Already checked out');

    return this.prisma.staffAttendance.update({
      where: { id: attendanceId },
      data: { outAt: new Date() },
    });
  }

  async getAttendance(societyId: string, userId: string, params: { staffId?: string | undefined; flatId?: string | undefined; dateFrom?: Date | undefined; dateTo?: Date | undefined } = {}) {
    await this.verifyMember(societyId, userId);
    
    const where: any = { staff: { societyId } };
    if (params.staffId) where.staffId = params.staffId;
    if (params.flatId) where.flatId = params.flatId;
    if (params.dateFrom || params.dateTo) {
      where.inAt = {};
      if (params.dateFrom) where.inAt.gte = params.dateFrom;
      if (params.dateTo) where.inAt.lte = params.dateTo;
    }

    return this.prisma.staffAttendance.findMany({
      where,
      include: { staff: true, flat: true },
      orderBy: { inAt: 'desc' },
    });
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

class BadRequestException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestException';
  }
}