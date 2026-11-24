import { Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { VisitsGateway } from './visits.gateway';

@Module({
  controllers: [VisitsController],
  providers: [VisitsService, VisitsGateway],
  exports: [VisitsService, VisitsGateway],
})
export class VisitsModule {}