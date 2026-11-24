import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PaymentProvider } from '../common/interfaces/otp-provider.interface';
import { MockPaymentProvider } from '../common/providers/mock-payment.provider';

@Module({
  providers: [
    BillingService,
    { provide: PaymentProvider, useClass: MockPaymentProvider },
  ],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}