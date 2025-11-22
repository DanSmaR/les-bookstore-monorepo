import { OrdersService } from '@/application/orders/services/orders.service';
import { PaginatedResultDTO } from '@/presentation/dtos/paginated-result.dto';
import { PaginationParamsDTO } from '@/presentation/dtos/pagination-params.dto';

import { OrderDTO } from '../order/dtos/order.dto';

export abstract class BaseUsersWebService {
  constructor(private readonly ordersService: OrdersService) {}

  public async getOrders(
    userId: string,
    params: PaginationParamsDTO,
    filters: Record<string, any> = {},
  ): Promise<PaginatedResultDTO<OrderDTO>> {
    const result = await this.ordersService.findByUser(
      userId,
      params.page,
      params.limit,
      filters,
      params.orderBy,
    );

    return new PaginatedResultDTO(
      result.items.map((item) => new OrderDTO(item)),
      result.count,
      params.limit,
      params.page,
    );
  }

  public async getRecentOrders(userId: string, limit: number = 5) {
    const result = await this.ordersService.findByUser(
      userId,
      1, // First page
      limit,
      {}, // No filters
      'orderDate', // Sort by order date
      'DESC', // Most recent first
    );

    return result.items;
  }
}
