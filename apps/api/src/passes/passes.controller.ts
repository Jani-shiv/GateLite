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
import { PassesService } from './passes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreatePassDto {
  flatId = '';
  visitorName = '';
  visitorPhone?: string;
  validFrom = '';
  validTo = '';
  usesLeft = 1;
  purpose?: string;
}

class VerifyCodeDto {
  code = '';
}

@ApiTags('passes')
@Controller('passes')
@UseGuards(JwtAuthGuard, SocietyScopeGuard)
@ApiBearerAuth()
export class PassesController {
  constructor(private passesService: PassesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a pre-approval pass' })
  async create(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreatePassDto,
  ) {
    return this.passesService.create(societyId, dto.flatId, userId, {
      ...dto,
      validFrom: new Date(dto.validFrom),
      validTo: new Date(dto.validTo),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all passes for current user\'s flat' })
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('flatId') flatId: string,
  ) {
    return this.passesService.findAll(societyId, userId, flatId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pass details' })
  async findOne(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.passesService.findOne(societyId, id, userId);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify pass code (online)' })
  async verifyCode(
    @CurrentUser('societyId') societyId: string,
    @Body() dto: VerifyCodeDto,
  ) {
    return this.passesService.verifyCode(societyId, dto.code);
  }

  @Post('verify-offline')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify pass code (offline - for guard app)' })
  async verifyCodeOffline(
    @CurrentUser('societyId') societyId: string,
    @Body() dto: VerifyCodeDto,
  ) {
    return this.passesService.verifyCodeOffline(societyId, dto.code);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke a pass' })
  async revoke(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    await this.passesService.revoke(societyId, id, userId);
  }
}