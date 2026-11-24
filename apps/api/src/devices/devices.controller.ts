import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class RegisterDeviceDto {
  deviceId = '';
  platform?: string;
}

@ApiTags('devices')
@Controller('devices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a device for push notifications' })
  async register(@CurrentUser('id') userId: string, @CurrentUser('societyId') societyId: string, @Body() dto: RegisterDeviceDto) {
    await this.devicesService.registerDevice(userId, dto.deviceId, societyId);
    return { message: 'Device registered successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'Get user devices' })
  async getDevices(@CurrentUser('id') userId: string) {
    return this.devicesService.getUserDevices(userId);
  }

  @Delete(':deviceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a device' })
  async removeDevice(@CurrentUser('id') userId: string, @Param('deviceId') deviceId: string) {
    await this.devicesService.removeDevice(userId, deviceId);
    return { message: 'Device removed successfully' };
  }
}