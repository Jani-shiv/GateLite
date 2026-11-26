import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { VisitsGateway } from './visits.gateway';
import { ProvidersModule } from '../common/providers/providers.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET')!,
        signOptions: {
          expiresIn: '15m',
        },
      }),
      inject: [ConfigService],
    }),
    ProvidersModule,
  ],
  controllers: [VisitsController],
  providers: [VisitsService, VisitsGateway],
  exports: [VisitsService, VisitsGateway],
})
export class VisitsModule {}