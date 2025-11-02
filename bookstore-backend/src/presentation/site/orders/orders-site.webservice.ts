import { Injectable } from '@nestjs/common';

import { ChangeOrderStatus } from '@/application/orders/use-cases/change-order-status/change-order-status.usecase';
import { CreateNewOrder } from '@/application/orders/use-cases/create-new-order.usecase';
import { PayOrder } from '@/application/orders/use-cases/pay-order.usecase';
import { UsersService } from '@/application/users/services';
import { OrderStatus } from '@/domain/order/status.enum';
import { OrderDTO } from '@/presentation/common/books/dtos/order.dto';

import { CreateNewOrderDTO } from './dtos/create-new-order.dto';
import { PaymentsDTO } from './dtos/payments.dto';

@Injectable()
export class OrdersSiteWebService {
  constructor(
    private readonly usersService: UsersService,
    private readonly createNewOrder: CreateNewOrder,
    private readonly payOrder: PayOrder,
    private readonly changeOrderStatus: ChangeOrderStatus,
  ) {}

  public async createOrder(
    dto: CreateNewOrderDTO,
    userId: string,
  ): Promise<OrderDTO> {
    return new OrderDTO(await this.createNewOrder.execute(dto, userId));
  }

  public async pay(orderId: string, dto: PaymentsDTO): Promise<OrderDTO> {
    return new OrderDTO(await this.payOrder.execute(orderId, dto));
  }

  public async changeStatus(
    orderId: string,
    userId: string,
    status: OrderStatus,
  ): Promise<OrderDTO> {
    const loggedUser = await this.usersService.findByIdOrThrow(userId);

    return new OrderDTO(
      await this.changeOrderStatus.execute(
        orderId,
        status,
        loggedUser.isAdmin() ? undefined : userId,
      ),
    );
  }
}
