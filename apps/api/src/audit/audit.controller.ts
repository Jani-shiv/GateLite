import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { MembershipRole } from '@prisma/client';

@ApiTags('audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, SocietyScopeGuard, RolesGuard)
@Roles(MembershipRole.ADMIN)
@ApiBearerAuth()
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs (admin only)' })
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('actorId') actorId?: string,
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('entityId') entityId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.auditService.findAll(societyId, userId, {
      page,
      limit,
      actorId,
      action,
      entity,
      entityId,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }

  @Get('meta/actions')
  @ApiOperation({ summary: 'Get unique actions' })
  async getActions() {
    return this.auditService.getActions();
  }

  @Get('meta/entities')
  @ApiOperation({ summary: 'Get unique entities' })
  async getEntities() {
    return this.auditService.getEntities();
  }
}