import { IsEnum, IsNotEmpty } from 'class-validator';

import { OrderStatus } from '@/domain/order/status.enum';

export class ChangeOrderStatusDTO {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
