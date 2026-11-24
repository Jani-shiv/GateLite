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
import { FlatsService } from './flats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreateFlatDto {
  blockId: string;
  number: string;
  floor: number;
}

class UpdateFlatDto {
  number?: string;
  floor?: number;
}

class BulkCreateFlatDto {
  flats: CreateFlatDto[];
}

@ApiTags('flats')
@Controller('societies/:societyId/flats')
@UseGuards(JwtAuthGuard, SocietyScopeGuard)
@ApiBearerAuth()
export class FlatsController {
  constructor(private flatsService: FlatsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new flat' })
  async create(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Body() dto: CreateFlatDto,
  ) {
    return this.flatsService.create(societyId, userId, dto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create multiple flats' })
  async bulkCreate(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Body() dto: BulkCreateFlatDto,
  ) {
    return this.flatsService.bulkCreate(societyId, userId, dto.flats);
  }

  @Post('import')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Import flats from CSV' })
  @ApiConsumes('text/csv')
  async importFromCsv(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Body('csv') csvData: string,
  ) {
    return this.flatsService.importFromCsv(societyId, userId, csvData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flats in a society' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Query('blockId') blockId?: string,
  ) {
    return this.flatsService.findAll(societyId, userId, blockId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get flat details' })
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.flatsService.findOne(societyId, id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update flat' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFlatDto,
  ) {
    return this.flatsService.update(societyId, id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete flat' })
  async delete(
    @CurrentUser('id') userId: string,
    @Param('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    await this.flatsService.delete(societyId, id, userId);
  }
}