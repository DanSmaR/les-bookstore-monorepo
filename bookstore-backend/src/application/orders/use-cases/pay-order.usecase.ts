import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { CardsService } from '@/application/users/services/cards.service';
import { UsersService } from '@/application/users/services/users.service';
import { Order } from '@/domain/order/order.entity';
import { Payment } from '@/domain/order/payment/payment.entity';
import { OrderStatus } from '@/domain/order/status.enum';
import { toPaymentMethod } from '@/domain/user/enums/card-type.enum';
import { PaymentsDTO } from '@/presentation/site/orders/dtos/payments.dto';

import { OrderAlreadyFullyPaidException } from '../exceptions/order-already-paid.exception';
import { PaymentGateway } from '../interfaces/payment/payment.gateway';
import { PaymentIntentRequest } from '../interfaces/payment/payment-intent-request';
import { OrdersService } from '../services/orders.service';
import { TicketsService } from '../services/tickets.service';
import { GenerateExchangeTicket } from './generate-exchange-ticket.use-case';

// TODO - Implement in the future a better payment flow, following good practices
@Injectable()
export class PayOrder {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cardsService: CardsService,
    @Inject('PaymentGateway') private readonly paymentGateway: PaymentGateway,
    private readonly ticketsService: TicketsService,
    private readonly generateExchangeTicket: GenerateExchangeTicket,
    private readonly usersService: UsersService,
  ) {}

  @Transactional()
  public async execute(orderId: string, payments: PaymentsDTO): Promise<Order> {
    const order = await this.ordersService.findByIdOrThrow(orderId);

    // Check if order is already confirmed (prevents duplicate payment attempts)
    if (order.status === OrderStatus.CONFIRMED) {
      throw new OrderAlreadyFullyPaidException(order.id);
    }

    this.validate(order, payments);
    await this.validateAppliedTickets(order);

    for (const paymentDTO of payments.payments) {
      const paymentIntentRequest: PaymentIntentRequest = {
        amount: paymentDTO.amount,
        cardId: paymentDTO.cardId,
        metadata: {
          orderId: order.id,
        },
      };

      const response =
        await this.paymentGateway.createPayment(paymentIntentRequest);

      const card = await this.cardsService.findByIdOrThrow(paymentDTO.cardId);

      const paymentEntity = new Payment({
        amount: paymentDTO.amount,
        method: toPaymentMethod(card.type),
        gatewayTransactionId: response.gatewayTransactionId,
        card,
      });

      if (response.status === 'succeeded') {
        paymentEntity.markAsPaid();
      }

      order.payments.push(paymentEntity);
    }

    // Check if order is fully paid (either by payments or fully covered by tickets)
    if (order.isFullyPaid()) {
      order.status = OrderStatus.CONFIRMED;

      // Mark tickets as USED and track usage per user
      for (const ticket of order.tickets) {
        if (ticket.ownerId) {
          // Personal tickets: Mark globally as USED (single-use)
          await this.ticketsService.markAsUsed(ticket);
        } else {
          // Public tickets: Track per-user usage (ticket stays ACTIVE for others)
          await this.usersService.addUsedTicketForUser(
            order.customer.user.id,
            ticket,
          );
        }
      }

      // Check if exchange tickets overpaid and generate exchange ticket for change (RN0036)
      const overpaymentAmount = order.getExchangeTicketsOverpayment();

      if (overpaymentAmount > 0) {
        await this.generateExchangeTicket.execute({
          userId: order.customer.user.id,
          originOrderId: order.id,
          amount: overpaymentAmount,
          reason: 'overpayment',
        });
      }
    }

    return await this.ordersService.save(order);
  }

  private validate(order: Order, dto: PaymentsDTO) {
    // Note: We check order.status === CONFIRMED at the beginning of execute()
    // to prevent duplicate payments. We don't check isFullyPaid() here because
    // for R$0.00 orders covered by tickets, isFullyPaid() returns true even
    // when status is still PENDING (tickets cover full amount but order not confirmed yet).

    const pendingPayments = order.getPendingPayments();

    if (pendingPayments.length > 0) {
      throw new BadRequestException(
        `Order ${order.id} has ${pendingPayments.length} pending payment(s). Please wait for current payment to complete before submitting another.`,
      );
    }

    const totalAmount = dto.payments.reduce(
      (acc, payment) => acc + payment.amount,
      0,
    );
    const finalPrice = order.getFinalPrice();

    if (totalAmount !== finalPrice) {
      throw new BadRequestException(
        `The total amount of payments (${totalAmount}) does not match the order total price (${finalPrice}).`,
      );
    }

    // Edge case: If order is fully covered by tickets (finalPrice = 0),
    // ensure we're not processing any payment with amount > 0
    if (finalPrice === 0 && dto.payments.some((p) => p.amount > 0)) {
      throw new BadRequestException(
        'Order is fully covered by tickets. No card payment is required.',
      );
    }
  }

  private async validateAppliedTickets(order: Order): Promise<void> {
    if (!order.tickets || order.tickets.length === 0) return;

    // Load user to check per-user ticket usage
    const user = await this.usersService.findByIdOrThrow(
      order.customer.user.id,
    );

    for (const ticket of order.tickets) {
      // Check if ticket is globally valid (not expired, not globally used)
      if (!ticket.isValid()) {
        throw new BadRequestException(
          `Ticket ${ticket.code} is no longer valid (expired or already used). Please reapply tickets.`,
        );
      }

      // Check if user has already used this ticket (per-user tracking for public tickets)
      if (user.customerDetails.hasUsedTicket(ticket)) {
        throw new BadRequestException(
          `Ticket ${ticket.code} has already been used by you. Please reapply tickets.`,
        );
      }
    }
  }
}
