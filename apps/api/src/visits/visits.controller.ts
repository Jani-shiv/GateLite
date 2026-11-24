import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VisitsService } from './visits.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { MembershipRole, VisitorType, VisitState } from '@prisma/client';
import { CreateWalkInDto, CreatePreApprovedDto, VerifyPassDto, ApproveVisitDto, CheckInDto, CheckOutDto } from './dto/visits.dto';

@ApiTags('visits')
@Controller('visits')
@UseGuards(JwtAuthGuard, SocietyScopeGuard)
@ApiBearerAuth()
export class VisitsController {
  constructor(private visitsService: VisitsService) {}

  @Post('walk-in')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.GUARD)
  @ApiOperation({ summary: 'Create walk-in visit (guard only)' })
  async createWalkIn(
    @CurrentUser('id') guardId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreateWalkInDto,
  ) {
    return this.visitsService.createWalkIn(societyId, guardId, dto);
  }

  @Post('pre-approved')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create pre-approved pass (resident)' })
  async createPreApproved(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreatePreApprovedDto,
  ) {
    return this.visitsService.createPreApproved(societyId, dto.flatId, userId, {
      ...dto,
      validFrom: new Date(dto.validFrom),
      validTo: new Date(dto.validTo),
    });
  }

  @Post('verify-pass')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.GUARD)
  @ApiOperation({ summary: 'Verify pass code (guard only)' })
  async verifyPass(
    @CurrentUser('id') guardId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: VerifyPassDto,
  ) {
    return this.visitsService.verifyPass(societyId, dto.code, guardId);
  }

  @Put(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve or deny visit (resident)' })
  async approveVisit(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: ApproveVisitDto,
  ) {
    return this.visitsService.approveVisit(societyId, id, userId, dto.action);
  }

  @Put(':id/check-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.GUARD)
  @ApiOperation({ summary: 'Check in visitor (guard only)' })
  async checkIn(
    @CurrentUser('id') guardId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.visitsService.checkIn(societyId, id, guardId);
  }

  @Put(':id/check-out')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.GUARD)
  @ApiOperation({ summary: 'Check out visitor (guard only)' })
  async checkOut(
    @CurrentUser('id') guardId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.visitsService.checkOut(societyId, id, guardId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get visit history for current user\'s flat' })
  async getHistory(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('flatId') flatId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.visitsService.getVisitHistory(societyId, userId, flatId, { page, limit });
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.GUARD)
  @ApiOperation({ summary: 'Get pending visits for guard' })
  async getPending(
    @CurrentUser('id') guardId: string,
    @CurrentUser('societyId') societyId: string,
  ) {
    return this.visitsService.getPendingVisits(societyId, guardId);
  }

  // Delivery & Cab quick flows
  @Post('delivery')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.GUARD)
  @ApiOperation({ summary: 'Create delivery visit (guard only)' })
  async createDelivery(
    @CurrentUser('id') guardId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreateWalkInDto,
  ) {
    return this.visitsService.createWalkIn(societyId, guardId, {
      ...dto,
      visitorType: VisitorType.DELIVERY,
    });
  }

  @Post('cab')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.GUARD)
  @ApiOperation({ summary: 'Create cab visit (guard only)' })
  async createCab(
    @CurrentUser('id') guardId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreateWalkInDto,
  ) {
    return this.visitsService.createWalkIn(societyId, guardId, {
      ...dto,
      visitorType: VisitorType.CAB,
    });
  }
}