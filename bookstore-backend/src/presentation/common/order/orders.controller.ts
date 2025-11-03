import { Body, Param, Patch, Request } from '@nestjs/common';

import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { AuthenticatedRequest } from '@/presentation/auth/interfaces';
import { ChangeOrderStatusDTO } from '@/presentation/site/orders/dtos/change-order-status.dto';
import { OrdersSiteWebService } from '@/presentation/site/orders/orders-site.webservice';

import { OrderDTO } from '../books/dtos/order.dto';

export abstract class OrdersController {
  constructor(protected readonly webService: OrdersSiteWebService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch(':id')
  public async changeOrderStatus(
    @Param('id') orderId: string,
    @Body() dto: ChangeOrderStatusDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDTO> {
    const userId = req.user.userId;
    return this.webService.changeStatus(orderId, userId, dto.status);
  }
}
