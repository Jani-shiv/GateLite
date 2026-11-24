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
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { MembershipRole } from '@prisma/client';

class CreateStaffDto {
  name = '';
  role = '';
}

class UpdateStaffDto {
  name?: string;
  role?: string;
}

class CheckInDto {
  flatId = '';
}

class CheckOutDto {}

@ApiTags('staff')
@Controller('staff')
@UseGuards(JwtAuthGuard, SocietyScopeGuard)
@ApiBearerAuth()
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Create staff member (admin only)' })
  async create(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreateStaffDto,
  ) {
    return this.staffService.create(societyId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all staff members' })
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
  ) {
    return this.staffService.findAll(societyId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get staff member details' })
  async findOne(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.staffService.findOne(societyId, id, userId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Update staff member (admin only)' })
  async update(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.staffService.update(societyId, id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Delete staff member (admin only)' })
  async delete(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    await this.staffService.delete(societyId, id, userId);
  }

  @Post(':id/check-in')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Staff check-in' })
  async checkIn(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: CheckInDto,
  ) {
    return this.staffService.checkIn(societyId, id, dto.flatId);
  }

  @Post('attendance/:attendanceId/check-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Staff check-out' })
  async checkOut(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('attendanceId') attendanceId: string,
  ) {
    return this.staffService.checkOut(societyId, attendanceId);
  }

  @Get('attendance')
  @ApiOperation({ summary: 'Get staff attendance records' })
  async getAttendance(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Query('staffId') staffId?: string,
    @Query('flatId') flatId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.staffService.getAttendance(societyId, userId, {
      staffId,
      flatId,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }
}