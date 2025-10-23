import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { BooksService } from '@/application/books/services/books.service';
import { UsersService } from '@/application/users/services';
import { Order } from '@/domain/order/order.entity';
import { OrderItem } from '@/domain/order/order-item.entity';
import { CreateNewOrderDTO } from '@/presentation/site/orders/dtos/create-new-order.dto';

import { OrdersService } from '../services/orders.service';

@Injectable()
export class CreateNewOrder {
  constructor(
    private readonly service: OrdersService,
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
  ) {}

  @Transactional()
  public async execute(dto: CreateNewOrderDTO, userId: string): Promise<Order> {
    const user = await this.usersService.findActiveByIdOrThrow(userId);
    const deliveryAddress = user.customerDetails.getAddress(
      dto.deliveryAddressId,
    );

    const order = new Order({
      customer: user.customerDetails,
      deliveryAddress,
    });

    for (const item of dto.items) {
      const book = await this.booksService.findByIdOrThrow(item.bookId);

      if (!book.isInStock(item.quantity)) {
        throw new BadRequestException(
          `Book with ID ${item.bookId} is out of stock or does not have enough stock.`,
        );
      }
      book.reduceStock(item.quantity);

      order.addItem(
        new OrderItem({
          book: await this.booksService.save(book),
          quantity: item.quantity,
        }),
      );
    }

    return await this.service.save(order);
  }
}
