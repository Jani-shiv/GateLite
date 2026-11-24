import { Module } from '@nestjs/common';
import { FlatsService } from './flats.service';
import { FlatsController } from './flats.controller';

@Module({
  controllers: [FlatsController],
  providers: [FlatsService],
  exports: [FlatsService],
})
export class FlatsModule {}