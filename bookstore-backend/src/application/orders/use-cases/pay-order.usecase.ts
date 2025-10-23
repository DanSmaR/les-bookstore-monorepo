import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { CardsService } from '@/application/users/services/cards.service';
import { Order } from '@/domain/order/order.entity';
import { Payment } from '@/domain/order/payment/payment.entity';
import { OrderStatus } from '@/domain/order/status.enum';
import { toPaymentMethod } from '@/domain/user/enums/card-type.enum';
import { PaymentsDTO } from '@/presentation/site/orders/dtos/payments.dto';

import { OrderAlreadyFullyPaidException } from '../exceptions/order-already-paid.exception';
import { PaymentGateway } from '../interfaces/payment/payment.gateway';
import { PaymentIntentRequest } from '../interfaces/payment/payment-intent-request';
import { OrdersService } from '../services/orders.service';

// TODO - Implement in the future a better payment flow, following good practices
@Injectable()
export class PayOrder {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cardsService: CardsService,
    @Inject('PaymentGateway') private readonly paymentGateway: PaymentGateway,
  ) {}

  @Transactional()
  public async execute(orderId: string, payments: PaymentsDTO): Promise<Order> {
    const order = await this.ordersService.findByIdOrThrow(orderId);

    this.validate(order, payments);

    for (const paymentDTO of payments.payments) {
      const paymentIntentRequest: PaymentIntentRequest = {
        amountInCents: Math.round(paymentDTO.amountInCents),
        cardId: paymentDTO.cardId,
        metadata: {
          orderId: order.id,
        },
      };

      const response =
        await this.paymentGateway.createPayment(paymentIntentRequest);

      const card = await this.cardsService.findByIdOrThrow(paymentDTO.cardId);

      const paymentEntity = new Payment({
        amountInCents: Math.round(paymentDTO.amountInCents),
        method: toPaymentMethod(card.type),
        gatewayTransactionId: response.gatewayTransactionId,
        card,
      });

      if (response.status === 'succeeded') {
        paymentEntity.markAsPaid();
      }

      order.payments.push(paymentEntity);
    }

    if (order.isFullyPaid()) {
      order.status = OrderStatus.CONFIRMED;
    }

    return await this.ordersService.save(order);
  }

  private validate(order: Order, dto: PaymentsDTO) {
    if (order.isFullyPaid()) {
      throw new OrderAlreadyFullyPaidException(order.id);
    }

    const pendingPayments = order.getPendingPayments();

    if (pendingPayments.length > 0) {
      throw new BadRequestException(
        `Order ${order.id} has ${pendingPayments.length} pending payment(s). Please wait for current payment to complete before submitting another.`,
      );
    }

    const totalAmount = Math.round(
      dto.payments.reduce((acc, payment) => acc + payment.amountInCents, 0),
    );
    const expectedAmount = Math.round(order.getTotalPrice() * 100);
    
    if (totalAmount !== expectedAmount) {
      throw new BadRequestException(
        'The total amount of payments does not match the order total price.',
      );
    }
  }
}
