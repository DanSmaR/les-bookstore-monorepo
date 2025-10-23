import { PaymentIntentRequest } from './payment-intent-request';
import { PaymentIntentResponse } from './payment-intent-response';

export interface PaymentGateway {
  createPayment(request: PaymentIntentRequest): Promise<PaymentIntentResponse>;
}
