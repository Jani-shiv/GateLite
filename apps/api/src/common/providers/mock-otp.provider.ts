import { Injectable } from '@nestjs/common';
import { OtpProvider } from '../interfaces/otp-provider.interface';

@Injectable()
export class MockOtpProvider implements OtpProvider {
  private codes = new Map<string, string>();

  async send(phone: string, code: string): Promise<void> {
    console.log(`[MOCK OTP] Sending to ${phone}: ${code}`);
    this.codes.set(phone, code);
  }

  async verify(phone: string, code: string): Promise<boolean> {
    const storedCode = this.codes.get(phone);
    const isValid = storedCode === code;
    console.log(`[MOCK OTP] Verifying ${phone}: ${code} -> ${isValid}`);
    return isValid;
  }

  // Helper for testing
  setCode(phone: string, code: string) {
    this.codes.set(phone, code);
  }

  getCode(phone: string): string | undefined {
    return this.codes.get(phone);
  }

  clear() {
    this.codes.clear();
  }
}

@Injectable()
export class ConsoleOtpProvider implements OtpProvider {
  async send(phone: string, code: string): Promise<void> {
    console.log(`[CONSOLE OTP] Sending to ${phone}: ${code}`);
  }

  async verify(phone: string, code: string): Promise<boolean> {
    console.log(`[CONSOLE OTP] Verifying ${phone}: ${code}`);
    // In development, accept any 6-digit code
    return code.length === 6 && /^\d{6}$/.test(code);
  }
}