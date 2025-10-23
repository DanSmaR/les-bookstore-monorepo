import { Injectable, Logger } from '@nestjs/common';

import { PaymentGateway } from '@/application/orders/interfaces/payment/payment.gateway';
import { PaymentIntentRequest } from '@/application/orders/interfaces/payment/payment-intent-request';
import { PaymentIntentResponse } from '@/application/orders/interfaces/payment/payment-intent-response';

@Injectable()
export class MockPaymentGateway implements PaymentGateway {
  public async createPayment(
    request: PaymentIntentRequest,
  ): Promise<PaymentIntentResponse> {
    Logger.log(
      `MockPaymentGateway: Creating payment for amount ${request.amountInCents} cents using card ${request.cardId}`,
      'MockPaymentGateway',
    );

    return await Promise.resolve({
      gatewayTransactionId: `mock_txn_${Math.random().toString(36).substring(2, 9)}`,
      status: 'succeeded',
    });
  }
}
