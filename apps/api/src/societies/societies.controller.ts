import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SocietiesService } from './societies.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreateSocietyDto {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

class UpdateSocietyDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

class UpdateSettingsDto {
  settings: Record<string, any>;
}

@ApiTags('societies')
@Controller('societies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SocietiesController {
  constructor(private societiesService: SocietiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new society' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateSocietyDto) {
    return this.societiesService.create({ ...dto, adminId: userId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all societies for current user' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.societiesService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get society details' })
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.societiesService.findOne(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update society details' })
  async update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateSocietyDto) {
    return this.societiesService.update(id, userId, dto);
  }

  @Get(':id/settings')
  @ApiOperation({ summary: 'Get society settings' })
  async getSettings(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.societiesService.getSettings(id, userId);
  }

  @Put(':id/settings')
  @ApiOperation({ summary: 'Update society settings' })
  async updateSettings(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateSettingsDto) {
    return this.societiesService.updateSettings(id, userId, dto.settings);
  }
}