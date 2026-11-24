import { Injectable } from '@nestjs/common';
import { 
  PaymentProvider, 
  CreateOrderParams, 
  PaymentOrder, 
  VerifyPaymentParams, 
  PaymentVerification, 
  RefundParams, 
  RefundResult 
} from '../interfaces/otp-provider.interface';

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  private orders = new Map<string, PaymentOrder>();
  private payments = new Map<string, PaymentVerification>();

  async createOrder(params: CreateOrderParams): Promise<PaymentOrder> {
    const orderId = `order_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const order: PaymentOrder = {
      id: orderId,
      amount: params.amount,
      currency: params.currency,
      receipt: params.receipt,
      status: 'created',
    };
    this.orders.set(orderId, order);
    console.log(`[MOCK PAYMENT] Created order:`, order);
    return order;
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerification> {
    const order = this.orders.get(params.orderId);
    if (!order) {
      return { success: false, orderId: params.orderId, paymentId: params.paymentId, amount: 0 };
    }

    // In mock, accept any payment with correct orderId
    const verification: PaymentVerification = {
      success: true,
      orderId: params.orderId,
      paymentId: params.paymentId,
      amount: order.amount,
    };
    this.payments.set(params.paymentId, verification);
    console.log(`[MOCK PAYMENT] Verified payment:`, verification);
    return verification;
  }

  async createRefund(params: RefundParams): Promise<RefundResult> {
    const refundId = `refund_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result: RefundResult = {
      id: refundId,
      status: 'processed',
      amount: params.amount,
    };
    console.log(`[MOCK PAYMENT] Created refund:`, result);
    return result;
  }

  // Helpers for testing
  getOrder(orderId: string): PaymentOrder | undefined {
    return this.orders.get(orderId);
  }

  getPayment(paymentId: string): PaymentVerification | undefined {
    return this.payments.get(paymentId);
  }

  clear() {
    this.orders.clear();
    this.payments.clear();
  }
}