import { Module } from '@nestjs/common';
import { MockOtpProvider, ConsoleOtpProvider } from './mock-otp.provider';
import { MockSmsProvider, MockWhatsAppProvider } from './mock-sms.provider';
import { MockPushProvider } from './mock-push.provider';
import { MockStorageProvider } from './mock-storage.provider';
import { MockPaymentProvider } from './mock-payment.provider';
import { OTP_PROVIDER, SMS_PROVIDER, WHATSAPP_PROVIDER, PUSH_PROVIDER, STORAGE_PROVIDER, PAYMENT_PROVIDER } from '../tokens';

@Module({
  providers: [
    {
      provide: OTP_PROVIDER,
      useClass: process.env['OTP_PROVIDER'] === 'console' ? ConsoleOtpProvider : MockOtpProvider,
    },
    {
      provide: SMS_PROVIDER,
      useClass: MockSmsProvider,
    },
    {
      provide: WHATSAPP_PROVIDER,
      useClass: MockWhatsAppProvider,
    },
    {
      provide: PUSH_PROVIDER,
      useClass: MockPushProvider,
    },
    {
      provide: STORAGE_PROVIDER,
      useClass: MockStorageProvider,
    },
    {
      provide: PAYMENT_PROVIDER,
      useClass: MockPaymentProvider,
    },
  ],
  exports: [
    OTP_PROVIDER,
    SMS_PROVIDER,
    WHATSAPP_PROVIDER,
    PUSH_PROVIDER,
    STORAGE_PROVIDER,
    PAYMENT_PROVIDER,
  ],
})
export class ProvidersModule {}