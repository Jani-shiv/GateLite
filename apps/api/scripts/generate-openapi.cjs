const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

const { AppModule } = require('../dist/app.module');

async function generateOpenAPI() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('GateLite API')
    .setDescription('Gated Community Management API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication')
    .addTag('societies', 'Society Management')
    .addTag('blocks', 'Block Management')
    .addTag('flats', 'Flat Management')
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
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  const outputDir = join(__dirname, '..', '..', '..', 'packages', 'api-client', 'src');
  mkdirSync(outputDir, { recursive: true });
  
  writeFileSync(join(outputDir, 'openapi.json'), JSON.stringify(document, null, 2));
  
  console.log('OpenAPI spec generated at packages/api-client/src/openapi.json');
  
  await app.close();
}

generateOpenAPI().catch((err) => {
  console.error('Failed to generate OpenAPI spec:', err);
  process.exit(1);
});