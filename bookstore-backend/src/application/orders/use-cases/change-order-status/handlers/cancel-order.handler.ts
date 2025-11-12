import { BadRequestException, Injectable } from '@nestjs/common';

import { BooksService } from '@/application/books/services/books.service';
import { UsersService } from '@/application/users/services';
import { OrderStatus } from '@/domain/order/enums/status.enum';
import { Order } from '@/domain/order/order.entity';

import { OrderStatusChangeHandler } from '../order-status-change-handler.interface';

@Injectable()
export class CancelOrderHandler implements OrderStatusChangeHandler {
  constructor(
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
  ) {}

  public async handle(order: Order, userId: string): Promise<Order> {
    if (!order.canBeCancelled()) {
      throw new BadRequestException(
        `Order with ID ${order.id} cannot be cancelled in its current status: ${order.status}`,
      );
    }

    for (const item of order.items) {
      item.book.increaseStock(item.quantity);
    }

    // Reinstate all tickets used in this order
    if (order.tickets && order.tickets.length > 0) {
      await this.usersService.reinstateTicketsForUser(userId, order.tickets);
    }

    await this.booksService.saveAll(order.items.map((item) => item.book));

    return order;
  }

  public getStatus(): OrderStatus {
    return OrderStatus.CANCELLED;
  }
}
