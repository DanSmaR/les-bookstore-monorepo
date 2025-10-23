import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrdersRepository } from '@/application/orders/interfaces/orders.repository';
import { Order } from '@/domain/order/order.entity';
import { OrderStatus } from '@/domain/order/status.enum';
import { User } from '@/domain/user/user.entity';

import { CRUDRepository } from './base.repository';

@Injectable()
export class OrdersRepositoryImpl
  extends CRUDRepository<Order>
  implements OrdersRepository
{
  constructor(@InjectRepository(Order) repository: Repository<Order>) {
    super(repository);
  }

  public async findByUserAndStatus(
    customer: User,
    status?: OrderStatus,
  ): Promise<Order[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.deliveryAddress', 'deliveryAddress')
      .leftJoinAndSelect('order._items', 'items')
      .leftJoinAndSelect('items.book', 'book')
      .leftJoinAndSelect('order._payments', 'payments')
      .leftJoinAndSelect('payments.card', 'card')
      .where('customer.id = :customerId', {
        customerId: customer.customerDetails.id,
      });

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    return queryBuilder.getMany();
  }
}
