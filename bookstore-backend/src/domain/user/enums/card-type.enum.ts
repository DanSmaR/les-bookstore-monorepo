import { PaymentMethod } from '@/domain/order/payment/enums/payment-method.enum';

export enum CardType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export function toPaymentMethod(cardType: CardType): PaymentMethod {
  switch (cardType) {
    case CardType.CREDIT:
      return PaymentMethod.CREDIT_CARD;
    case CardType.DEBIT:
      return PaymentMethod.DEBIT_CARD;
  }
}
