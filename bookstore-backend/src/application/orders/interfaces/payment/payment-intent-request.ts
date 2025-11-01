export interface PaymentIntentRequest {
  amount: number;
  cardId: string;
  metadata?: Record<string, any>;
}
