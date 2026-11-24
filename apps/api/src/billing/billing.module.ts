import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PAYMENT_PROVIDER } from '../common/tokens';
import { MockPaymentProvider } from '../common/providers/mock-payment.provider';

@Module({
  providers: [
    BillingService,
    { provide: 'PAYMENT_PROVIDER', useClass: MockPaymentProvider },
  ],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}