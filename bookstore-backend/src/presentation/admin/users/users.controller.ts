import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/infrastructure/auth/guards';
import { ChangeOrderStatusDTO } from '@/presentation/common/order/dtos/change-order-status.dto';
import { ChangeRefundStatusDTO } from '@/presentation/common/order/dtos/change-refund-status.dto';
import { OrderDTO } from '@/presentation/common/order/dtos/order.dto';
import { PaginatedResultDTO } from '@/presentation/dtos/paginated-result.dto';
import { PaginationParamsDTO } from '@/presentation/dtos/pagination-params.dto';
import { RefundRequestDTO } from '@/presentation/site/orders/dtos/refund-request.dto';

import { CustomerDTO } from './dtos/customer.dto';
import { MinUserDTO } from './dtos/min-user.dto';
import { UsersWebService } from './users.webservice';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersWebService: UsersWebService) {}

  @Get()
  public async findAll(
    @Query() query: PaginationParamsDTO,
    @Query() filters: Record<string, any> = {},
  ): Promise<PaginatedResultDTO<MinUserDTO>> {
    return this.usersWebService.findAll(query, filters);
  }

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<CustomerDTO> {
    return await this.usersWebService.findById(id);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.usersWebService.inactivate(id);
  }

  @Get(':id/orders')
  public async getOrders(
    @Param('id') id: string,
    @Query() query: PaginationParamsDTO,
    @Query() filters: Record<string, any> = {},
  ) {
    return this.usersWebService.getOrders(id, query, filters);
  }

  @Patch(':id/orders/:orderId')
  public async changeOrderStatus(
    @Param('id') userId: string,
    @Param('orderId') orderId: string,
    @Body() dto: ChangeOrderStatusDTO,
  ): Promise<OrderDTO> {
    return this.usersWebService.changeOrderStatus(orderId, dto.status, userId);
  }

  @Post(':id/orders/:orderId/refunds')
  public async refundOrderItems(
    @Param('id') userId: string,
    @Param('orderId') orderId: string,
    @Body() dto: RefundRequestDTO,
  ): Promise<OrderDTO> {
    return await this.usersWebService.refundItems(orderId, dto, userId);
  }

  @Patch(':id/orders/:orderId/refunds/:refundId')
  public async changeRefundStatus(
    @Param('id') userId: string,
    @Param('orderId') orderId: string,
    @Param('refundId') refundId: string,
    @Body() dto: ChangeRefundStatusDTO,
  ): Promise<OrderDTO> {
    return this.usersWebService.changeRefundStatus(
      orderId,
      refundId,
      dto.status,
      userId,
    );
  }
}
