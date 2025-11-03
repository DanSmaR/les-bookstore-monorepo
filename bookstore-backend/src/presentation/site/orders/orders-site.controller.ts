import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/infrastructure/auth/guards';
import { AuthenticatedRequest } from '@/presentation/auth/interfaces';
import { OrderDTO } from '@/presentation/common/books/dtos/order.dto';
import { OrdersController } from '@/presentation/common/order/orders.controller';

import { CreateNewOrderDTO } from './dtos/create-new-order.dto';
import { PaymentsDTO } from './dtos/payments.dto';
import { OrdersSiteWebService } from './orders-site.webservice';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('orders')
export class OrdersSiteController extends OrdersController {
  constructor(webService: OrdersSiteWebService) {
    super(webService);
  }

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
  ): Promise<OrderDTO> {
    return await this.webService.pay(orderId, dto);
  }
}
