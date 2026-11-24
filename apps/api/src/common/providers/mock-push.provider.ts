import { Injectable } from '@nestjs/common';
import { PushProvider, PushPayload } from '../interfaces/otp-provider.interface';

@Injectable()
export class MockPushProvider implements PushProvider {
  async sendPush(token: string, payload: PushPayload): Promise<void> {
    console.log(`[MOCK PUSH] Sending to ${token}:`, payload);
  }

  async sendToTopic(topic: string, payload: PushPayload): Promise<void> {
    console.log(`[MOCK PUSH] Sending to topic ${topic}:`, payload);
  }
}