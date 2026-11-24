import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  async create(societyId: string, userId: string, data: {
    name: string;
    rules?: Record<string, any>;
    fee?: number;
  }) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.amenity.create({
      data: { societyId, name: data.name, rules: data.rules || {}, fee: data.fee ?? null },
    });
  }

  async findAll(societyId: string, userId: string) {
    await this.verifyMember(societyId, userId);
    return this.prisma.amenity.findMany({
      where: { societyId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(societyId: string, id: string, userId: string) {
    await this.verifyMember(societyId, userId);
    const amenity = await this.prisma.amenity.findFirst({
      where: { id, societyId },
      include: { bookings: { where: { status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] } }, orderBy: { slotStart: 'asc' } } },
    });
    if (!amenity) throw new NotFoundException('Amenity not found');
    return amenity;
  }

  async update(societyId: string, id: string, userId: string, data: { name?: string; rules?: Record<string, any>; fee?: number; isActive?: boolean }) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.amenity.update({ where: { id }, data });
  }

  async delete(societyId: string, id: string, userId: string) {
    await this.verifyAdmin(societyId, userId);
    return this.prisma.amenity.delete({ where: { id } });
  }

  async createBooking(societyId: string, userId: string, data: {
    amenityId: string;
    flatId: string;
    slotStart: Date;
    slotEnd: Date;
  }) {
    await this.verifyMember(societyId, userId);

    const amenity = await this.prisma.amenity.findFirst({ where: { id: data.amenityId, societyId, isActive: true } });
    if (!amenity) throw new NotFoundException('Amenity not found');

    // Check for conflicts
    const conflict = await this.prisma.booking.findFirst({
      where: {
        amenityId: data.amenityId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        OR: [
          { slotStart: { lt: data.slotEnd }, slotEnd: { gt: data.slotStart } },
        ],
      },
    });

    if (conflict) throw new ConflictException('Time slot already booked');

    return this.prisma.booking.create({
      data: {
        amenityId: data.amenityId,
        flatId: data.flatId,
        userId,
        slotStart: data.slotStart,
        slotEnd: data.slotEnd,
      },
    });
  }

  async getBookings(societyId: string, userId: string, params: { amenityId?: string | undefined; flatId?: string | undefined; status?: BookingStatus | undefined } = {}) {
    await this.verifyMember(societyId, userId);
    
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Access denied');
    const isAdmin = membership.role === 'ADMIN';

    const where: any = { amenity: { societyId } };
    if (!isAdmin) where.flatId = membership.flatId;
    else if (params.flatId) where.flatId = params.flatId;
    if (params.amenityId) where.amenityId = params.amenityId;
    if (params.status) where.status = params.status;

    return this.prisma.booking.findMany({
      where,
      include: { amenity: true, flat: true, user: { select: { id: true, name: true } } },
      orderBy: { slotStart: 'desc' },
    });
  }

  async updateBooking(societyId: string, id: string, userId: string, data: { status?: BookingStatus }) {
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Access denied');

    const booking = await this.prisma.booking.findFirst({ where: { id, amenity: { societyId } } });
    if (!booking) throw new NotFoundException('Booking not found');

    const isAdmin = membership.role === 'ADMIN';
    if (!isAdmin && booking.userId !== userId) {
      throw new ForbiddenException('Can only update your own bookings');
    }

    if (data.status && data.status === BookingStatus.CONFIRMED && !isAdmin) {
      throw new ForbiddenException('Only admins can confirm bookings');
    }

    return this.prisma.booking.update({ where: { id }, data });
  }

  private async verifyAdmin(societyId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, role: 'ADMIN', status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Admin access required');
  }

  private async verifyMember(societyId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Access denied');
  }
}