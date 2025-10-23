export interface PaymentIntentResponse {
  gatewayTransactionId: string;
  status: 'succeeded' | 'failed' | 'pending';
}
