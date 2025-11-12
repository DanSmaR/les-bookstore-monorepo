import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { OrdersService } from '@/application/orders/services/orders.service';
import { RefundStatus } from '@/domain/order/enums/refund-status.enum';
import { Order } from '@/domain/order/order.entity';

import { RefundStatusChangeHandler } from './refund-status-change-handler.interface';

@Injectable()
export class ChangeRefundStatus {
  private readonly handlers: Map<RefundStatus, RefundStatusChangeHandler>;

  constructor(
    private readonly ordersService: OrdersService,
    @Inject('RefundStatusChangeHandlers')
    refundStatusChangeHandlers: RefundStatusChangeHandler[],
  ) {
    this.handlers = new Map();
    for (const handler of refundStatusChangeHandlers) {
      this.handlers.set(handler.getStatus(), handler);
    }
  }

  @Transactional()
  public async execute(
    orderId: string,
    refundId: string,
    status: RefundStatus,
    userId: string,
  ): Promise<Order> {
    const order = await this.ordersService.findByIdAndUserOrThrow(
      orderId,
      userId,
    );
    const refund = order.refunds?.find((r) => r.id === refundId);
    if (!refund) {
      throw new NotFoundException(
        `Refund with ID ${refundId} not found in order ${order.id}`,
      );
    }

    const handler = this.handlers.get(status);
    if (handler) {
      await handler.handle(refund, userId, order);
    }

    refund.status = status;

    await this.ordersService.save(order);

    return order;
  }
}
