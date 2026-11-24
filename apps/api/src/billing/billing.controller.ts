import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SocietyScopeGuard } from '../common/guards/society-scope.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { MembershipRole, InvoiceStatus, PaymentStatus } from '@prisma/client';

class CreateInvoiceDto {
  flatId = '';
  period = '';
  amount = 0;
  dueDate = '';
}

class BulkCreateInvoiceDto {
  invoices: CreateInvoiceDto[] = [];
}

class VerifyPaymentDto {
  orderId = '';
  paymentId = '';
  signature = '';
}

@ApiTags('billing')
@Controller('billing')
@UseGuards(JwtAuthGuard, SocietyScopeGuard)
@ApiBearerAuth()
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post('invoices')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Create invoice (admin only)' })
  async createInvoice(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.billingService.createInvoice(societyId, userId, {
      ...dto,
      dueDate: new Date(dto.dueDate),
    });
  }

  @Post('invoices/bulk')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.ADMIN)
  @ApiOperation({ summary: 'Bulk create invoices (admin only)' })
  async bulkCreateInvoices(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: BulkCreateInvoiceDto,
  ) {
    return this.billingService.bulkCreateInvoices(societyId, userId, dto.invoices.map(inv => ({
      ...inv,
      dueDate: new Date(inv.dueDate),
    })));
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get invoices' })
  async findInvoices(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: InvoiceStatus,
    @Query('flatId') flatId?: string,
  ) {
    return this.billingService.findInvoices(societyId, userId, { page, limit, status, flatId });
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice details' })
  async findInvoice(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.billingService.findInvoice(societyId, id, userId);
  }

  @Post('invoices/:id/pay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate payment for invoice' })
  async initiatePayment(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Param('id') id: string,
  ) {
    return this.billingService.initiatePayment(societyId, id, userId);
  }

  @Post('payments/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify payment callback' })
  async verifyPayment(
    @CurrentUser('societyId') societyId: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.billingService.verifyPayment(societyId, dto);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get payments' })
  async getPayments(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
    @Query('invoiceId') invoiceId?: string,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.billingService.getPayments(societyId, userId, { invoiceId, status });
  }

  @Get('dues')
  @ApiOperation({ summary: 'Get outstanding dues' })
  async getOutstandingDues(
    @CurrentUser('id') userId: string,
    @CurrentUser('societyId') societyId: string,
  ) {
    return this.billingService.getOutstandingDues(societyId, userId);
  }
}