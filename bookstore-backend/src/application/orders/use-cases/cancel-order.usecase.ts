import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { BooksService } from '@/application/books/services/books.service';
import { Order } from '@/domain/order/order.entity';

import { OrdersService } from '../services/orders.service';

@Injectable()
export class CancelOrder {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly booksService: BooksService,
  ) {}

  @Transactional()
  public async execute(orderId: string, userId: string): Promise<Order> {
    const order = await this.ordersService.findByIdAndUserOrThrow(
      orderId,
      userId,
    );

    if (!order.canBeCancelled()) {
      throw new BadRequestException(
        `Order with ID ${orderId} cannot be cancelled in its current status: ${order.status}`,
      );
    }

    order.cancel();

    for (const item of order.items) {
      item.book.increaseStock(item.quantity);
    }

    await this.booksService.saveAll(order.items.map((item) => item.book));
    return await this.ordersService.save(order);
  }
}
