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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ResidentsService } from './residents.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { MembershipRole, MembershipStatus } from '@prisma/client';

class InviteResidentDto {
  flatId = '';
  phone = '';
  name = '';
  role?: MembershipRole;
  isOwner?: boolean;
}

class UpdateResidentDto {
  role?: MembershipRole;
  status?: MembershipStatus;
  isOwner?: boolean;
}

class AcceptInviteDto {
  societyId = '';
  flatId = '';
}

@ApiTags('residents')
@Controller('residents')
@UseGuards(JwtAuthGuard, SocietyScopeGuard)
@ApiBearerAuth()
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  @Post('invite')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Invite a resident to a flat (admin only)' })
  async invite(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: InviteResidentDto,
  ) {
    return this.residentsService.inviteResident(societyId, userId, dto);
  }

  @Post('accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a resident invitation' })
  async acceptInvite(
    @CurrentUser('id') userId: string,
    @Body() dto: AcceptInviteDto,
  ) {
    return this.residentsService.acceptInvite(userId, dto.societyId, dto.flatId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all residents for current user' })
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('flatId') flatId?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    const params: { page?: number; limit?: number; flatId?: string; role?: string; status?: string } = {};
    if (page) params.page = parseInt(page, 10);
    if (limit) params.limit = parseInt(limit, 10);
    if (flatId) params.flatId = flatId;
    if (role) params.role = role;
    if (status) params.status = status;
    return this.residentsService.findAll(societyId, userId, params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resident details' })
  async findOne(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.residentsService.findOne(societyId, id, userId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Update resident (admin only)' })
  async update(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateResidentDto,
  ) {
    return this.residentsService.update(societyId, id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Remove resident (admin only)' })
  async remove(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    await this.residentsService.remove(societyId, id, userId);
  }

  @Post('import')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiConsumes('text/csv')
  @ApiOperation({ summary: 'Import residents from CSV (admin only)' })
  async importFromCsv(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body('csv') csvData: string,
  ) {
    return this.residentsService.importFromCsv(societyId, userId, csvData);
  }
}