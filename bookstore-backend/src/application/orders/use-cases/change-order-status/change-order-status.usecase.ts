import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { OrdersService } from '@/application/orders/services/orders.service';
import { Order } from '@/domain/order/order.entity';
import { OrderStatus } from '@/domain/order/status.enum';

import { OrderStatusChangeHandler } from './order-status-change-handler.interface';

@Injectable()
export class ChangeOrderStatus {
  private readonly handlers: Map<OrderStatus, OrderStatusChangeHandler>;

  constructor(
    private readonly service: OrdersService,
    @Inject('OrderStatusChangeHandlers') handlers: OrderStatusChangeHandler[],
  ) {
    this.handlers = new Map();
    handlers.forEach((handler) => {
      this.handlers.set(handler.getStatus(), handler);
    });
  }

  @Transactional()
  public async execute(
    orderId: string,
    status: OrderStatus,
    userId?: string,
  ): Promise<Order> {
    const order = userId
      ? await this.service.findByIdAndUserOrThrow(orderId, userId)
      : await this.service.findByIdOrThrow(orderId);

    const handler = this.handlers.get(status);
    if (handler) {
      await handler.handle(order, userId);
    }

    order.status = status;

    return this.service.save(order);
  }
}
