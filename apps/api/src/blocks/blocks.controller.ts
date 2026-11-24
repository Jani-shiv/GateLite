import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlocksService } from './blocks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreateBlockDto {
  name: string;
}

class UpdateBlockDto {
  name: string;
}

@ApiTags('blocks')
@Controller('societies/:societyId/blocks')
@UseGuards(JwtAuthGuard, SocietyScopeGuard)
@ApiBearerAuth()
export class BlocksController {
  constructor(private blocksService: BlocksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new block' })
  async create(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Body() dto: CreateBlockDto,
  ) {
    return this.blocksService.create(societyId, userId, dto.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blocks in a society' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
  ) {
    return this.blocksService.findAll(societyId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get block details' })
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.blocksService.findOne(societyId, id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update block' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBlockDto,
  ) {
    return this.blocksService.update(societyId, id, userId, dto.name);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete block' })
  async delete(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    await this.blocksService.delete(societyId, id, userId);
  }
}