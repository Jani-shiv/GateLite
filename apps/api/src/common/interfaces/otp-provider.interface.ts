export interface OtpProvider {
  send(phone: string, code: string): Promise<void>;
  verify(phone: string, code: string): Promise<boolean>;
}

export interface SmsProvider {
  send(phone: string, message: string): Promise<void>;
}

export interface WhatsAppProvider {
  send(phone: string, templateName: string, parameters: Record<string, string>): Promise<void>;
}

export interface PushProvider {
  sendPush(token: string, payload: PushPayload): Promise<void>;
  sendToTopic(topic: string, payload: PushPayload): Promise<void>;
}

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: string;
  badge?: number;
}

export interface StorageProvider {
  upload(key: string, file: Buffer, contentType: string): Promise<string>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn: number): Promise<string>;
}

export interface PaymentProvider {
  createOrder(params: CreateOrderParams): Promise<PaymentOrder>;
  verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerification>;
  createRefund(params: RefundParams): Promise<RefundResult>;
}

export interface CreateOrderParams {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentVerification {
  success: boolean;
  orderId: string;
  paymentId: string;
  amount: number;
}

export interface RefundParams {
  paymentId: string;
  amount: number;
  reason?: string;
}

export interface RefundResult {
  id: string;
  status: string;
  amount: number;
}