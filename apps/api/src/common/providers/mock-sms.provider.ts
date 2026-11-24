import { Injectable } from '@nestjs/common';
import { SmsProvider, WhatsAppProvider } from '../interfaces/otp-provider.interface';

@Injectable()
export class MockSmsProvider implements SmsProvider {
  async send(phone: string, message: string): Promise<void> {
    console.log(`[MOCK SMS] Sending to ${phone}: ${message}`);
  }
}

@Injectable()
export class MockWhatsAppProvider implements WhatsAppProvider {
  async send(phone: string, templateName: string, parameters: Record<string, string>): Promise<void> {
    console.log(`[MOCK WHATSAPP] Sending to ${phone}: ${templateName}`, parameters);
  }
}