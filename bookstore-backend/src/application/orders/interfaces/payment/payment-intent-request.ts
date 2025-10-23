export interface PaymentIntentRequest {
  amountInCents: number;
  cardId: string;
  metadata?: Record<string, any>;
}
