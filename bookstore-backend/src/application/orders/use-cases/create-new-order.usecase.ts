import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { BooksService } from '@/application/books/services/books.service';
import { UsersService } from '@/application/users/services';
import { Order } from '@/domain/order/order.entity';
import { OrderItem } from '@/domain/order/order-item.entity';
import { User } from '@/domain/user/user.entity';
import { CreateNewOrderDTO } from '@/presentation/site/orders/dtos/create-new-order.dto';

import { OrdersService } from '../services/orders.service';
import { TicketsService } from '../services/tickets.service';
import { ValidateTicket } from './tickets/validate-ticket.usecase';

@Injectable()
export class CreateNewOrder {
  constructor(
    private readonly service: OrdersService,
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
    private readonly ticketsService: TicketsService,
    private readonly validateTicket: ValidateTicket,
  ) {}

  @Transactional()
  public async execute(dto: CreateNewOrderDTO, userId: string): Promise<Order> {
    const user = await this.usersService.findActiveByIdOrThrow(userId);

    await this.validate(dto, user);
    const deliveryAddress = user.customerDetails.getAddress(
      dto.deliveryAddressId,
    );

    const order = new Order({
      customer: user.customerDetails,
      deliveryAddress,
    });

    // Tickets are now applied AFTER order creation using ApplyTicketsToOrder use case
    // This allows for multi-ticket optimization (RN0036)

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

  private async validate(dto: CreateNewOrderDTO, user: User): Promise<void> {
    if (!user.customerDetails.hasAddress(dto.deliveryAddressId)) {
      throw new BadRequestException(
        `User does not have an address with ID ${dto.deliveryAddressId}.`,
      );
    }

    // Ticket validation is now done in ApplyTicketsToOrder use case
  }
}
