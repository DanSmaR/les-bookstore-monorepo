import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { BaseService } from '@/application/base.service';
import { PaginatedResult } from '@/application/paginated-result';
import { UsersService } from '@/application/users/services';
import { Book } from '@/domain/book.entity';
import { Order } from '@/domain/order/order.entity';

import { OrdersRepository } from '../interfaces/orders.repository';

@Injectable()
export class OrdersService extends BaseService<Order> {
  constructor(
    @Inject('OrdersRepository')
    private readonly repository: OrdersRepository,
    private readonly usersService: UsersService,
  ) {
    super(repository);
  }

  public async findByUser(
    userId: string,
    page: number,
    limit: number,
    filters: Record<string, any> = {},
    sortField?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<PaginatedResult<Order>> {
    const user = await this.usersService.findActiveCustomerByIdOrThrow(userId);
    filters['customer'] = { id: user.customerDetails.id };
    return await this.findAll(page, limit, filters, sortField, sortOrder);
  }

  async findByIdAndUserOrThrow(
    orderId: string,
    userId: string,
  ): Promise<Order> {
    const order = await this.repository.findByIdAndUserId(orderId, userId);

    if (!order) {
      throw new BadRequestException(
        `Order with ID ${orderId} does not belong to the user.`,
      );
    }

    return order;
  }

  public async findLastBoughtBooksByUser(
    userId: string,
    limit: number = 10,
  ): Promise<Book[]> {
    return await this.repository.findLastBoughtBooksByUser(userId, limit);
  }
}
