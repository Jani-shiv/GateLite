import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AmenitiesService } from './amenities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { MembershipRole, BookingStatus } from '@prisma/client';

class CreateAmenityDto {
  name = '';
  rules?: Record<string, any>;
  fee?: number;
}

class UpdateAmenityDto {
  name?: string;
  rules?: Record<string, any>;
  fee?: number;
  isActive?: boolean;
}

class CreateBookingDto {
  amenityId = '';
  flatId = '';
  slotStart = '';
  slotEnd = '';
}

class UpdateBookingDto {
  status?: BookingStatus;
}

@ApiTags('amenities')
@Controller('amenities')
@UseGuards(JwtAuthGuard, SocietyScopeGuard)
@ApiBearerAuth()
export class AmenitiesController {
  constructor(private amenitiesService: AmenitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Create amenity (admin only)' })
  async create(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreateAmenityDto,
  ) {
    return this.amenitiesService.create(societyId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all amenities' })
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
  ) {
    return this.amenitiesService.findAll(societyId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get amenity details' })
  async findOne(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.amenitiesService.findOne(societyId, id, userId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Update amenity (admin only)' })
  async update(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAmenityDto,
  ) {
    return this.amenitiesService.update(societyId, id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Delete amenity (admin only)' })
  async delete(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    await this.amenitiesService.delete(societyId, id, userId);
  }

  @Post('bookings')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create booking' })
  async createBooking(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.amenitiesService.createBooking(societyId, userId, {
      ...dto,
      slotStart: new Date(dto.slotStart),
      slotEnd: new Date(dto.slotEnd),
    });
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get bookings' })
  async getBookings(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Query('amenityId') amenityId?: string,
    @Query('flatId') flatId?: string,
    @Query('status') status?: BookingStatus,
  ) {
    return this.amenitiesService.getBookings(societyId, userId, { amenityId, flatId, status });
  }

  @Put('bookings/:id')
  @ApiOperation({ summary: 'Update booking status' })
  async updateBooking(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.amenitiesService.updateBooking(societyId, id, userId, dto);
  }
}