import { Module } from '@nestjs/common';
import { MockOtpProvider, ConsoleOtpProvider } from './mock-otp.provider';
import { MockSmsProvider, MockWhatsAppProvider } from './mock-sms.provider';
import { MockPushProvider } from './mock-push.provider';
import { MockStorageProvider } from './mock-storage.provider';
import { MockPaymentProvider } from './mock-payment.provider';
import { OtpProvider, SmsProvider, WhatsAppProvider, PushProvider, StorageProvider, PaymentProvider } from '../interfaces/otp-provider.interface';

@Module({
  providers: [
    {
      provide: OtpProvider,
      useClass: process.env.OTP_PROVIDER === 'console' ? ConsoleOtpProvider : MockOtpProvider,
    },
    {
      provide: SmsProvider,
      useClass: MockSmsProvider,
    },
    {
      provide: WhatsAppProvider,
      useClass: MockWhatsAppProvider,
    },
    {
      provide: PushProvider,
      useClass: MockPushProvider,
    },
    {
      provide: StorageProvider,
      useClass: MockStorageProvider,
    },
    {
      provide: PaymentProvider,
      useClass: MockPaymentProvider,
    },
  ],
  exports: [
    OtpProvider,
    SmsProvider,
    WhatsAppProvider,
    PushProvider,
    StorageProvider,
    PaymentProvider,
  ],
})
export class ProvidersModule {}