import { IsEnum, IsNotEmpty } from 'class-validator';

import { OrderStatus } from '@/domain/order/enums/status.enum';

export class ChangeOrderStatusDTO {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
