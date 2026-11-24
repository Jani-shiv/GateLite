import { Injectable } from '@nestjs/common';
import { StorageProvider } from '../interfaces/otp-provider.interface';

@Injectable()
export class MockStorageProvider implements StorageProvider {
  private files = new Map<string, { buffer: Buffer; contentType: string }>();

  async upload(key: string, file: Buffer, contentType: string): Promise<string> {
    console.log(`[MOCK STORAGE] Uploading ${key} (${file.length} bytes, ${contentType})`);
    this.files.set(key, { buffer: file, contentType });
    return `mock://storage/${key}`;
  }

  async delete(key: string): Promise<void> {
    console.log(`[MOCK STORAGE] Deleting ${key}`);
    this.files.delete(key);
  }

  async getSignedUrl(key: string, expiresIn: number): Promise<string> {
    console.log(`[MOCK STORAGE] Getting signed URL for ${key} (expires in ${expiresIn}s)`);
    return `mock://storage/${key}?signed=true&expires=${expiresIn}`;
  }

  // Helper for testing
  getFile(key: string): { buffer: Buffer; contentType: string } | undefined {
    return this.files.get(key);
  }

  clear() {
    this.files.clear();
  }
}