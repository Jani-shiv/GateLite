import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SocietiesModule } from './societies/societies.module';
import { VisitsModule } from './visits/visits.module';
import { PassesModule } from './passes/passes.module';
import { NoticesModule } from './notices/notices.module';
import { TicketsModule } from './tickets/tickets.module';
import { StaffModule } from './staff/staff.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { BillingModule } from './billing/billing.module';
import { DevicesModule } from './devices/devices.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    SocietiesModule,
    VisitsModule,
    PassesModule,
    NoticesModule,
    TicketsModule,
    StaffModule,
    AmenitiesModule,
    BillingModule,
    DevicesModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}