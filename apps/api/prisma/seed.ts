import { PrismaClient, MembershipRole, MembershipStatus, UserStatus, VisitState, VisitorType, TicketCategory, TicketStatus, TicketPriority, InvoiceStatus, PaymentStatus, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo society
  const society = await prisma.society.upsert({
    where: { id: 'demo-society-id' },
    update: {},
    create: {
      id: 'demo-society-id',
      name: 'Green Valley Society',
      address: 'SG Highway',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380054',
      plan: 'pro',
      settings: {
        escalationTimeoutSeconds: 30,
        photoRetentionDays: 90,
        workingHours: { start: '06:00', end: '22:00' },
        escalationPolicy: 'HOLD',
      },
    },
  });
  console.log('✅ Society created:', society.name);

  // Create blocks
  const blocks = await Promise.all([
    prisma.block.upsert({
      where: { id: 'block-a' },
      update: {},
      create: { id: 'block-a', societyId: society.id, name: 'A' },
    }),
    prisma.block.upsert({
      where: { id: 'block-b' },
      update: {},
      create: { id: 'block-b', societyId: society.id, name: 'B' },
    }),
    prisma.block.upsert({
      where: { id: 'block-c' },
      update: {},
      create: { id: 'block-c', societyId: society.id, name: 'C' },
    }),
  ]);
  console.log('✅ Blocks created:', blocks.map(b => b.name).join(', '));

  // Create flats (150 flats across 3 blocks, 5 floors each, 10 flats per floor)
  const flats = [];
  for (const block of blocks) {
    for (let floor = 1; floor <= 5; floor++) {
      for (let num = 1; num <= 10; num++) {
        const flatNumber = `${floor}${num.toString().padStart(2, '0')}`;
        const flat = await prisma.flat.upsert({
          where: { societyId_blockId_number: { societyId: society.id, blockId: block.id, number: flatNumber } },
          update: {},
          create: { societyId: society.id, blockId: block.id, number: flatNumber, floor },
        });
        flats.push(flat);
      }
    }
  }
  console.log('✅ Flats created:', flats.length);

  // Create users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { phone: '+919876543210' },
    update: {},
    create: {
      phone: '+919876543210',
      name: 'Admin User',
      status: UserStatus.ACTIVE,
    },
  });

  const guardUser = await prisma.user.upsert({
    where: { phone: '+919876543211' },
    update: {},
    create: {
      phone: '+919876543211',
      name: 'Guard Kumar',
      status: UserStatus.ACTIVE,
    },
  });

  const residentUser = await prisma.user.upsert({
    where: { phone: '+919876543212' },
    update: {},
    create: {
      phone: '+919876543212',
      name: 'Rajesh Patel',
      status: UserStatus.ACTIVE,
    },
  });

  const residentUser2 = await prisma.user.upsert({
    where: { phone: '+919876543213' },
    update: {},
    create: {
      phone: '+919876543213',
      name: 'Priya Sharma',
      status: UserStatus.ACTIVE,
    },
  });

  console.log('✅ Users created');

  // Create memberships
  await prisma.membership.upsert({
    where: { userId_societyId_flatId: { userId: adminUser.id, societyId: society.id, flatId: flats[0].id } },
    update: {},
    create: {
      userId: adminUser.id,
      societyId: society.id,
      flatId: flats[0].id,
      role: MembershipRole.ADMIN,
      isOwner: true,
      status: MembershipStatus.ACTIVE,
    },
  });

  await prisma.membership.upsert({
    where: { userId_societyId_flatId: { userId: guardUser.id, societyId: society.id, flatId: flats[0].id } },
    update: {},
    create: {
      userId: guardUser.id,
      societyId: society.id,
      flatId: flats[0].id,
      role: MembershipRole.GUARD,
      isOwner: false,
      status: MembershipStatus.ACTIVE,
    },
  });

  await prisma.membership.upsert({
    where: { userId_societyId_flatId: { userId: residentUser.id, societyId: society.id, flatId: flats[10].id } },
    update: {},
    create: {
      userId: residentUser.id,
      societyId: society.id,
      flatId: flats[10].id,
      role: MembershipRole.OWNER,
      isOwner: true,
      status: MembershipStatus.ACTIVE,
    },
  });

  await prisma.membership.upsert({
    where: { userId_societyId_flatId: { userId: residentUser2.id, societyId: society.id, flatId: flats[20].id } },
    update: {},
    create: {
      userId: residentUser2.id,
      societyId: society.id,
      flatId: flats[20].id,
      role: MembershipRole.OWNER,
      isOwner: true,
      status: MembershipStatus.ACTIVE,
    },
  });

  console.log('✅ Memberships created');

  // Create staff
  const staff = await prisma.staff.create({
    data: {
      societyId: society.id,
      name: 'Ramesh Cleaning',
      role: 'CLEANING',
      qrCode: 'staff_qr_001',
    },
  });

  const staff2 = await prisma.staff.create({
    data: {
      societyId: society.id,
      name: 'Suresh Security',
      role: 'SECURITY',
      qrCode: 'staff_qr_002',
    },
  });

  console.log('✅ Staff created');

  // Create amenities
  const gym = await prisma.amenity.create({
    data: {
      societyId: society.id,
      name: 'Gym',
      fee: 500,
      rules: { maxHours: 2, advanceBookingDays: 7 },
    },
  });

  const clubhouse = await prisma.amenity.create({
    data: {
      societyId: society.id,
      name: 'Clubhouse',
      fee: 2000,
      rules: { maxHours: 4, advanceBookingDays: 30, maxGuests: 50 },
    },
  });

  const tennis = await prisma.amenity.create({
    data: {
      societyId: society.id,
      name: 'Tennis Court',
      fee: 300,
      rules: { maxHours: 1, advanceBookingDays: 7 },
    },
  });

  console.log('✅ Amenities created');

  // Create sample notices
  await prisma.notice.create({
    data: {
      societyId: society.id,
      title: 'Welcome to Green Valley Society!',
      body: 'We are excited to have you on board. Please download the GateLite app for visitor management, notices, and more.',
      pinned: true,
      publishedAt: new Date(),
      createdById: adminUser.id,
    },
  });

  await prisma.notice.create({
    data: {
      societyId: society.id,
      title: 'Water Supply Maintenance',
      body: 'Water supply will be shut down on Sunday 10 AM - 2 PM for routine maintenance. Please store water in advance.',
      pinned: false,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdById: adminUser.id,
    },
  });

  console.log('✅ Notices created');

  // Create sample tickets
  await prisma.ticket.create({
    data: {
      societyId: society.id,
      flatId: flats[10].id,
      reporterId: residentUser.id,
      category: TicketCategory.MAINTENANCE,
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
      title: 'Water leakage in bathroom',
      description: 'There is a water leakage in the master bathroom. Water is dripping from the ceiling.',
    },
  });

  await prisma.ticket.create({
    data: {
      societyId: society.id,
      flatId: flats[20].id,
      reporterId: residentUser2.id,
      category: TicketCategory.NOISE,
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.MEDIUM,
      title: 'Loud music from neighbor',
      description: 'Flat A-302 is playing loud music late at night.',
    },
  });

  console.log('✅ Tickets created');

  // Create sample invoices
  for (let i = 0; i < 10; i++) {
    const flat = flats[i];
    await prisma.invoice.create({
      data: {
        societyId: society.id,
        flatId: flat.id,
        period: '2026-11',
        amount: 2500 + Math.floor(Math.random() * 1000),
        dueDate: new Date('2026-12-10'),
        status: i < 7 ? InvoiceStatus.PENDING : InvoiceStatus.PAID,
      },
    });
  }

  console.log('✅ Invoices created');

  // Create sample visitors and visits
  const visitor1 = await prisma.visitor.create({
    data: {
      societyId: society.id,
      name: 'Amit Shah',
      phone: '+919988776655',
      type: VisitorType.VISITOR,
    },
  });

  const visitor2 = await prisma.visitor.create({
    data: {
      societyId: society.id,
      name: 'Zomato Delivery',
      phone: '+919988776656',
      type: VisitorType.DELIVERY,
    },
  });

  await prisma.visit.create({
    data: {
      societyId: society.id,
      flatId: flats[10].id,
      visitorId: visitor1.id,
      guardId: guardUser.id,
      state: VisitState.APPROVED,
      purpose: 'Personal visit',
      inAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      outAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  });

  await prisma.visit.create({
    data: {
      societyId: society.id,
      flatId: flats[20].id,
      visitorId: visitor2.id,
      guardId: guardUser.id,
      state: VisitState.ENTERED,
      purpose: 'Food delivery',
      inAt: new Date(Date.now() - 30 * 60 * 1000),
    },
  });

  console.log('✅ Visitors and visits created');

  // Create audit logs
  await prisma.auditLog.createMany({
    data: [
      { societyId: society.id, actorId: adminUser.id, action: 'SOCIETY_CREATE', entity: 'Society', entityId: society.id },
      { societyId: society.id, actorId: adminUser.id, action: 'USER_INVITE', entity: 'User', entityId: residentUser.id },
      { societyId: society.id, actorId: residentUser.id, action: 'PASS_CREATE', entity: 'Pass', entityId: 'sample-pass-id' },
      { societyId: society.id, actorId: guardUser.id, action: 'VISIT_CREATE', entity: 'Visit', entityId: 'sample-visit-id' },
    ],
  });

  console.log('✅ Audit logs created');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });