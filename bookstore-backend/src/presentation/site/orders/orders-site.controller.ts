import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/infrastructure/auth/guards';
import { AuthenticatedRequest } from '@/presentation/auth/interfaces';
import { ChangeRefundStatusDTO } from '@/presentation/common/order/dtos/change-refund-status.dto';
import { OrderDTO } from '@/presentation/common/order/dtos/order.dto';

import { ChangeOrderStatusDTO } from '../../common/order/dtos/change-order-status.dto';
import { CreateNewOrderDTO } from './dtos/create-new-order.dto';
import { PaymentsDTO } from './dtos/payments.dto';
import { RefundRequestDTO } from './dtos/refund-request.dto';
import { OrdersSiteWebService } from './orders-site.webservice';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('orders')
export class OrdersSiteController {
  constructor(private readonly webService: OrdersSiteWebService) {}

  @Post()
  public async createOrder(
    @Body() dto: CreateNewOrderDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDTO> {
    const userId = req.user.userId;
    return await this.webService.createOrder(dto, userId);
  }

  @Post(':id/pay')
  public async payOrder(
    @Param('id') orderId: string,
    @Body() dto: PaymentsDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDTO> {
    const userId = req.user.userId;
    return await this.webService.pay(orderId, dto, userId);
  }

  @Post(':id/refunds')
  public async refundOrderItems(
    @Param('id') orderId: string,
    @Body() dto: RefundRequestDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDTO> {
    const userId = req.user.userId;
    return await this.webService.refundItems(orderId, dto, userId);
  }

  @Patch(':id')
  public async changeOrderStatus(
    @Param('id') orderId: string,
    @Body() dto: ChangeOrderStatusDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDTO> {
    const userId = req.user.userId;
    return this.webService.changeStatus(orderId, userId, dto.status);
  }

  @Patch(':id/refunds/:refundId')
  public async changeRefundStatus(
    @Param('id') orderId: string,
    @Param('refundId') refundId: string,
    @Body() dto: ChangeRefundStatusDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDTO> {
    const userId = req.user.userId;
    return this.webService.changeRefundStatus(
      orderId,
      refundId,
      userId,
      dto.status,
    );
  }
}
