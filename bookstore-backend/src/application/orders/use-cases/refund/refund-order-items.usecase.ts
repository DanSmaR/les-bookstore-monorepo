import { BadRequestException, Injectable } from '@nestjs/common';

import { OrdersService } from '@/application/orders/services/orders.service';
import { Order } from '@/domain/order/order.entity';
import { Refund } from '@/domain/order/refund.entity';
import { RefundItem } from '@/domain/order/refund-item.entity';

interface RefundRequestItemDTO {
  bookId: string;
  quantity: number;
}

interface RefundRequestDTO {
  items: RefundRequestItemDTO[];
  reason?: string;
}

@Injectable()
export class RefundOrderItems {
  constructor(private readonly ordersService: OrdersService) {}

  public async execute(
    id: string,
    dto: RefundRequestDTO,
    userId: string,
  ): Promise<Order> {
    const order = await this.ordersService.findByIdAndUserOrThrow(id, userId);

    if (!order.canBeRefunded()) {
      throw new BadRequestException(
        'Order cannot be refunded in its current status or has expired refund period',
      );
    }

    if (order.isTherePendingRefunds()) {
      throw new BadRequestException(
        'There is already a pending refund for this order',
      );
    }

    const refund = new Refund({
      reason: dto.reason,
    });

    refund.items.push(...this.validateAndCreateRefundItems(order, dto.items));
    order.refunds.push(refund);

    return this.ordersService.save(order);
  }

  private validateAndCreateRefundItems(
    order: Order,
    requestItems: RefundRequestItemDTO[],
  ): RefundItem[] {
    const refundedQuantities = order.getRefundedQuantitiesByItem();
    const refundItems: RefundItem[] = [];

    for (const requestItem of requestItems) {
      const orderItem = order.items.find(
        (item) => item.bookId === requestItem.bookId,
      );

      if (!orderItem) {
        throw new BadRequestException(
          `Order item with bookId ${requestItem.bookId} not found`,
        );
      }

      const alreadyRefunded = refundedQuantities.get(orderItem.bookId) || 0;
      const availableForRefund = orderItem.quantity - alreadyRefunded;

      if (requestItem.quantity > availableForRefund) {
        throw new BadRequestException(
          `Cannot refund ${requestItem.quantity} items. Only ${availableForRefund} available for refund`,
        );
      }

      refundItems.push(
        new RefundItem({
          orderItem,
          quantity: requestItem.quantity,
          unitPrice: orderItem.unitPrice,
        }),
      );
    }

    return refundItems;
  }
}
