import { Module } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { PushProvider } from '../common/interfaces/otp-provider.interface';
import { MockPushProvider } from '../common/providers/mock-push.provider';

@Module({
  providers: [
    NoticesService,
    { provide: PushProvider, useClass: MockPushProvider },
  ],
  controllers: [NoticesController],
  exports: [NoticesService],
})
export class NoticesModule {}