import { Module } from '@nestjs/common';
import { SocietiesService } from './societies.service';
import { SocietiesController } from './societies.controller';
import { BlocksModule } from '../blocks/blocks.module';
import { FlatsModule } from '../flats/flats.module';

@Module({
  imports: [BlocksModule, FlatsModule],
  controllers: [SocietiesController],
  providers: [SocietiesService],
  exports: [SocietiesService],
})
export class SocietiesModule {}