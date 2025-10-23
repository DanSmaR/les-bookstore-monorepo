import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { OrderStatus } from '@/domain/order/status.enum';
import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/infrastructure/auth/guards';
import { AuthenticatedRequest } from '@/presentation/auth/interfaces';
import { OrderDTO } from '@/presentation/common/books/dtos/order.dto';

import { CreateNewOrderDTO } from './dtos/create-new-order.dto';
import { PaymentsDTO } from './dtos/payments.dto';
import { OrdersWebService } from './orders.webservice';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('orders')
export class OrdersController {
  constructor(private readonly webService: OrdersWebService) {}

  @Post()
  public async createOrder(
    @Body() dto: CreateNewOrderDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDTO> {
    const userId = req.user.userId;
    return await this.webService.createOrder(dto, userId);
  }

  @Get()
  public async getOrders(
    @Request() req: AuthenticatedRequest,
    @Query('status') status?: OrderStatus,
  ): Promise<OrderDTO[]> {
    const userId = req.user.userId;
    return this.webService.findByUserAndStatus(userId, status);
  }

  @Post(':id/pay')
  public async payOrder(
    @Param('id') orderId: string,
    @Body() dto: PaymentsDTO,
  ): Promise<OrderDTO> {
    return await this.webService.pay(orderId, dto);
  }

  @Patch(':id/cancel')
  public async cancelOrder(
    @Param('id') orderId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDTO> {
    const userId = req.user.userId;
    return this.webService.cancel(orderId, userId);
  }
}
