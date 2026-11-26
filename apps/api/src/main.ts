import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  
  // Global prefix
  app.setGlobalPrefix('v1');
  
  // CORS
  app.enableCors({
    origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('GateLite API')
    .setDescription('Gated Community Management API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication')
    .addTag('societies', 'Society Management')
    .addTag('residents', 'Resident Management')
    .addTag('visits', 'Visitor Management')
    .addTag('passes', 'Pre-approval Passes')
    .addTag('notices', 'Notice Board')
    .addTag('tickets', 'Complaints & Tickets')
    .addTag('staff', 'Staff Management')
    .addTag('amenities', 'Amenity Booking')
    .addTag('billing', 'Billing & Payments')
    .addTag('audit', 'Audit Logs')
    .addTag('devices', 'Device Management')
    .addTag('blocks', 'Block Management')
    .addTag('flats', 'Flat Management')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  const port = process.env['PORT'] || 4000;
  await app.listen(port);
  console.log(`🚀 GateLite API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();