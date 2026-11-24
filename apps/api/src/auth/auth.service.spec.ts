import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { OtpProvider } from '../common/interfaces/otp-provider.interface';
import { DevicesService } from '../devices/devices.service';

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn().mockReturnValue({
    sub: 'user-1',
    phone: '+919876543210',
    societyId: 'society-1',
    flatId: 'flat-1',
    role: 'OWNER',
    deviceId: 'device-1',
  }),
};

const mockOtpProvider = {
  send: jest.fn().mockResolvedValue(undefined),
  verify: jest.fn().mockResolvedValue(true),
};

const mockDevicesService = {
  registerDevice: jest.fn().mockResolvedValue(undefined),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const values: Record<string, string> = {
      JWT_ACCESS_SECRET: 'test-access-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      PASS_SIGNING_KEY: 'test-signing-key',
    };
    return values[key];
  }),
};

const createMockPrisma = () => ({
  otpRequest: {
    count: jest.fn().mockResolvedValue(0),
    create: jest.fn().mockResolvedValue({}),
    findFirst: jest.fn().mockResolvedValue({ id: '1', consumed: false }),
    update: jest.fn().mockResolvedValue({}),
  },
  user: {
    findUnique: jest.fn().mockResolvedValue({
      id: 'user-1',
      phone: '+919876543210',
      name: 'Test User',
      status: 'ACTIVE',
    }),
    create: jest.fn().mockResolvedValue({
      id: 'user-1',
      phone: '+919876543210',
      name: 'Test User',
      status: 'ACTIVE',
    }),
  },
  membership: {
    findFirst: jest.fn().mockResolvedValue({
      societyId: 'society-1',
      flatId: 'flat-1',
      role: 'OWNER',
      flat: { id: 'flat-1', number: 'A-101' },
      society: { id: 'society-1', name: 'Test Society' },
    }),
  },
  refreshToken: {
    create: jest.fn().mockResolvedValue({}),
    findUnique: jest.fn().mockResolvedValue({ revoked: false, expiresAt: new Date(Date.now() + 86400000) }),
    update: jest.fn().mockResolvedValue({}),
    updateMany: jest.fn().mockResolvedValue({}),
  },
  device: {
    upsert: jest.fn().mockResolvedValue({}),
  },
});

describe('AuthService', () => {
  let service: AuthService | undefined;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'PrismaService', useValue: createMockPrisma() },
        { provide: 'JwtService', useValue: mockJwtService },
        { provide: 'ConfigService', useValue: mockConfigService },
        { provide: 'OtpProvider', useValue: mockOtpProvider },
        { provide: 'DevicesService', useValue: mockDevicesService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});