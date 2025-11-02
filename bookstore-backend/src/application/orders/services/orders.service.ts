import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { BaseService } from '@/application/base.service';
import { PaginatedResult } from '@/application/paginated-result';
import { UsersService } from '@/application/users/services';
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
    const user = await this.usersService.findActiveCustomerByIdOrThrow(userId);
    const order = await this.findByIdOrThrow(orderId);

    if (!user.customerDetails.orders.some((o) => o.id === order.id)) {
      throw new BadRequestException(
        `Order with ID ${orderId} does not belong to the user.`,
      );
    }

    return order;
  }
}
