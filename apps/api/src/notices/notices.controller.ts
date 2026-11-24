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
import { NoticesService } from './notices.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { MembershipRole } from '@prisma/client';

class CreateNoticeDto {
  title: string;
  body: string;
  pinned?: boolean;
  publishAt?: string;
}

class UpdateNoticeDto {
  title?: string;
  body?: string;
  pinned?: boolean;
  publishAt?: string | null;
}

@ApiTags('notices')
@Controller('notices')
@UseGuards(JwtAuthGuard, SocietyScopeGuard)
@ApiBearerAuth()
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Create a notice (admin only)' })
  async create(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreateNoticeDto,
  ) {
    return this.noticesService.create(societyId, userId, {
      ...dto,
      publishAt: dto.publishAt ? new Date(dto.publishAt) : undefined,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all notices' })
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('published') published?: string,
  ) {
    return this.noticesService.findAll(societyId, userId, {
      page,
      limit,
      published: published === 'true' ? true : published === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notice details' })
  async findOne(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.noticesService.findOne(societyId, id, userId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Update notice (admin only)' })
  async update(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNoticeDto,
  ) {
    return this.noticesService.update(societyId, id, userId, {
      ...dto,
      publishAt: dto.publishAt ? new Date(dto.publishAt) : dto.publishAt === null ? null : undefined,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Delete notice (admin only)' })
  async delete(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    await this.noticesService.delete(societyId, id, userId);
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark notice as read' })
  async markAsRead(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.noticesService.markAsRead(societyId, id, userId);
  }
}