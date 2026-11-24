import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaymentProvider, CreateOrderParams, VerifyPaymentParams } from '../common/interfaces/otp-provider.interface';
import { InvoiceStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class BillingService {
  constructor(
    private prisma: PrismaService,
    private paymentProvider: PaymentProvider,
  ) {}

  async createInvoice(societyId: string, userId: string, data: {
    flatId: string;
    period: string;
    amount: number;
    dueDate: Date;
  }) {
    await this.verifyAdmin(societyId, userId);
    
    return this.prisma.invoice.create({
      data: {
        societyId,
        flatId: data.flatId,
        period: data.period,
        amount: data.amount,
        dueDate: data.dueDate,
      },
    });
  }

  async bulkCreateInvoices(societyId: string, userId: string, invoices: Array<{
    flatId: string;
    period: string;
    amount: number;
    dueDate: Date;
  }>) {
    await this.verifyAdmin(societyId, userId);
    
    return this.prisma.$transaction(
      invoices.map(inv => this.prisma.invoice.create({ data: { societyId, ...inv } }))
    );
  }

  async findInvoices(societyId: string, userId: string, params: {
    page?: number;
    limit?: number;
    status?: InvoiceStatus;
    flatId?: string;
  } = {}) {
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === 'ADMIN';
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { societyId };
    if (!isAdmin) where.flatId = membership.flatId;
    else if (params.flatId) where.flatId = params.flatId;
    if (params.status) where.status = params.status;

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: { flat: true, payments: true },
        orderBy: { dueDate: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return { invoices, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findInvoice(societyId: string, id: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === 'ADMIN';
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, societyId, ...(!isAdmin && { flatId: membership.flatId }) },
      include: { flat: true, payments: true },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async initiatePayment(societyId: string, invoiceId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Access denied');

    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, societyId, ...(!membership.role === 'ADMIN' && { flatId: membership.flatId }) },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.status !== InvoiceStatus.PENDING && invoice.status !== InvoiceStatus.OVERDUE) {
      throw new BadRequestException('Invoice cannot be paid');
    }

    const orderParams: CreateOrderParams = {
      amount: Number(invoice.amount),
      currency: 'INR',
      receipt: `inv_${invoice.id}`,
      notes: { invoiceId: invoice.id, flatId: invoice.flatId },
    };

    const order = await this.paymentProvider.createOrder(orderParams);

    // Store payment record
    const payment = await this.prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        gatewayRef: order.id,
        amount: invoice.amount,
        status: PaymentStatus.PENDING,
      },
    });

    return { order, payment };
  }

  async verifyPayment(societyId: string, data: VerifyPaymentParams) {
    const verification = await this.paymentProvider.verifyPayment(data);
    
    if (verification.success) {
      const payment = await this.prisma.payment.findUnique({ where: { gatewayRef: verification.orderId } });
      if (payment) {
        await this.prisma.$transaction([
          this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: PaymentStatus.SUCCESS, paidAt: new Date(), gatewayRef: verification.paymentId },
          }),
          this.prisma.invoice.update({
            where: { id: payment.invoiceId },
            data: { status: InvoiceStatus.PAID },
          }),
        ]);
      }
    }

    return verification;
  }

  async getPayments(societyId: string, userId: string, params: { invoiceId?: string; status?: PaymentStatus } = {}) {
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === 'ADMIN';
    const where: any = { invoice: { societyId } };
    if (!isAdmin) where.invoice.flatId = membership.flatId;
    if (params.invoiceId) where.invoiceId = params.invoiceId;
    if (params.status) where.status = params.status;

    return this.prisma.payment.findMany({
      where,
      include: { invoice: { include: { flat: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOutstandingDues(societyId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Access denied');

    const isAdmin = membership.role === 'ADMIN';
    const where: any = { societyId, status: { in: [InvoiceStatus.PENDING, InvoiceStatus.OVERDUE] } };
    if (!isAdmin) where.flatId = membership.flatId;

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: { flat: true },
      orderBy: { dueDate: 'asc' },
    });

    const total = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const overdue = invoices.filter(inv => inv.dueDate < new Date() && inv.status === InvoiceStatus.PENDING).length;

    return { invoices, total, overdueCount: overdue };
  }

  private async verifyAdmin(societyId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({ where: { userId, societyId, role: 'ADMIN', status: 'ACTIVE' } });
    if (!membership) throw new ForbiddenException('Admin access required');
  }
}