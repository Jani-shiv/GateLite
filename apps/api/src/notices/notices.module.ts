import { Module } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { MockPushProvider } from '../common/providers/mock-push.provider';

@Module({
  providers: [
    NoticesService,
    { provide: 'PUSH_PROVIDER', useClass: MockPushProvider },
  ],
  controllers: [NoticesController],
  exports: [NoticesService],
})
export class NoticesModule {}