import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { BaseService } from '@/application/base.service';
import { UsersService } from '@/application/users/services';
import { Order } from '@/domain/order/order.entity';
import { OrderStatus } from '@/domain/order/status.enum';

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

  public async findByUserAndStatus(userId: string, status?: OrderStatus) {
    const user = await this.usersService.findActiveCustomerByIdOrThrow(userId);
    return await this.repository.findByUserAndStatus(user, status);
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
