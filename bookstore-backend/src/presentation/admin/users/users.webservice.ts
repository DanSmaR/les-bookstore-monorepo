import { UsersService } from '@application/users/services';
import { Injectable } from '@nestjs/common';

import { OrdersService } from '@/application/orders/services/orders.service';
import { ChangeOrderStatus } from '@/application/orders/use-cases/change-order-status/change-order-status.usecase';
import { ChangeRefundStatus } from '@/application/orders/use-cases/refund/change-refund-status/change-refund-status.usecase';
import { RefundOrderItems } from '@/application/orders/use-cases/refund/refund-order-items.usecase';
import { RefundStatus } from '@/domain/order/enums/refund-status.enum';
import { OrderStatus } from '@/domain/order/enums/status.enum';
import { UserRole } from '@/domain/user/enums/role.enum';
import { OrderDTO } from '@/presentation/common/order/dtos/order.dto';
import { BaseUsersWebService } from '@/presentation/common/users/base-users.webservice';
import { PaginatedResultDTO } from '@/presentation/dtos/paginated-result.dto';
import { PaginationParamsDTO } from '@/presentation/dtos/pagination-params.dto';
import { RefundRequestDTO } from '@/presentation/site/orders/dtos/refund-request.dto';

import { MinUserDTO } from './dtos';
import { CustomerDTO } from './dtos/customer.dto';

@Injectable()
export class UsersWebService extends BaseUsersWebService {
  constructor(
    private readonly usersService: UsersService,
    ordersService: OrdersService,
    private readonly changeOrderStatusUseCase: ChangeOrderStatus,
    private readonly changeRefundStatusUseCase: ChangeRefundStatus,
    private readonly refundOrderItems: RefundOrderItems,
  ) {
    super(ordersService);
  }

  public async findById(id: string): Promise<CustomerDTO> {
    const user = await this.usersService.findByIdOrThrow(id);
    return new CustomerDTO(user, await user.customerDetails.getRecentOrders(5));
  }

  public async findAll(
    params: PaginationParamsDTO,
    filters: Record<string, any> = {},
  ): Promise<PaginatedResultDTO<MinUserDTO>> {
    // Add filter to exclude admin users from customer list
    const customersOnlyFilters = {
      ...filters,
      role: UserRole.USER,
    };

    const result = await this.usersService.findAll(
      params.page,
      params.limit,
      customersOnlyFilters,
      params.orderBy,
    );

    return new PaginatedResultDTO(
      await Promise.all(
        result.items.map(
          async (item) =>
            new MinUserDTO(
              item,
              (await item.customerDetails.getMostRecentOrder())?.orderDate,
            ),
        ),
      ),
      result.count,
      params.limit,
      params.page,
    );
  }

  public async changeOrderStatus(
    orderId: string,
    status: OrderStatus,
    userId: string,
  ): Promise<OrderDTO> {
    return new OrderDTO(
      await this.changeOrderStatusUseCase.execute(orderId, status, userId),
    );
  }

  public async refundItems(
    id: string,
    dto: RefundRequestDTO,
    userId: string,
  ): Promise<OrderDTO> {
    return new OrderDTO(await this.refundOrderItems.execute(id, dto, userId));
  }

  public async changeRefundStatus(
    orderId: string,
    refundId: string,
    status: RefundStatus,
    userId: string,
  ): Promise<OrderDTO> {
    const order = await this.changeRefundStatusUseCase.execute(
      orderId,
      refundId,
      status,
      userId,
    );
    return new OrderDTO(order);
  }

  public async inactivate(id: string): Promise<void> {
    await this.usersService.inactivate(id);
  }
}
