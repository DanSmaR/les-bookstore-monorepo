import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrdersRepository } from '@/application/orders/interfaces/orders.repository';
import { Book } from '@/domain/book.entity';
import { OrderStatus } from '@/domain/order/enums/status.enum';
import { Order } from '@/domain/order/order.entity';

import { CRUDRepository } from './base.repository';

@Injectable()
export class OrdersRepositoryImpl
  extends CRUDRepository<Order>
  implements OrdersRepository
{
  constructor(@InjectRepository(Order) repository: Repository<Order>) {
    super(repository);
  }

  public async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Order | null> {
    return this.repository.findOne({
      where: {
        id,
        customer: { user: { id: userId } },
      },
    });
  }

  public async findLastBoughtBooksByUser(
    userId: string,
    limit: number,
  ): Promise<Book[]> {
    const subQuery = this.repository
      .createQueryBuilder('order')
      .innerJoin('order.customer', 'customer')
      .innerJoin('customer.user', 'user')
      .innerJoin('order._items', 'item')
      .select('item.bookId', 'book_id')
      .addSelect('MAX(order.orderDate)', 'last_order_date')
      .where('user.id = :userId', { userId })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [
          OrderStatus.DELIVERED,
          OrderStatus.SHIPPED,
          OrderStatus.CONFIRMED,
        ], // Only count successful orders
      })
      .groupBy('item.bookId')
      .orderBy('last_order_date', 'DESC')
      .limit(limit);

    return await this.repository.manager
      .createQueryBuilder(Book, 'book')
      .innerJoin(
        `(${subQuery.getQuery()})`,
        'recent_books',
        'book.id = recent_books.book_id',
      )
      .setParameters(subQuery.getParameters())
      .orderBy('recent_books.last_order_date', 'DESC')
      .getMany();
  }
}
