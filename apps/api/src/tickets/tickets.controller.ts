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
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { MembershipRole, TicketCategory, TicketStatus, TicketPriority } from '@prisma/client';

class CreateTicketDto {
  flatId?: string;
  category = TicketCategory.MAINTENANCE;
  priority = TicketPriority.MEDIUM;
  title = '';
  description = '';
}

class UpdateTicketDto {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
}

class AddCommentDto {
  body = '';
  isInternal?: boolean;
}

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard, SocietyScopeGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a ticket' })
  async create(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreateTicketDto,
  ) {
    return this.ticketsService.create(societyId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: TicketStatus,
    @Query('category') category?: TicketCategory,
    @Query('priority') priority?: TicketPriority,
    @Query('flatId') flatId?: string,
  ) {
    return this.ticketsService.findAll(societyId, userId, { page, limit, status, category, priority, flatId });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get ticket statistics' })
  async getStats(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
  ) {
    return this.ticketsService.getStats(societyId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket details' })
  async findOne(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.ticketsService.findOne(societyId, id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ticket' })
  async update(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(societyId, id, userId, dto);
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add comment to ticket' })
  async addComment(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: AddCommentDto,
  ) {
    return this.ticketsService.addComment(societyId, id, userId, dto.body, dto.isInternal);
  }

  @Get('meta/categories')
  @ApiOperation({ summary: 'Get ticket categories' })
  async getCategories() {
    return this.ticketsService.getCategories();
  }
}