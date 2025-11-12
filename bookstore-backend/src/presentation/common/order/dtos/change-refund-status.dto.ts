import { IsEnum, IsNotEmpty } from 'class-validator';

import { RefundStatus } from '@/domain/order/enums/refund-status.enum';

export class ChangeRefundStatusDTO {
  @IsEnum(RefundStatus)
  @IsNotEmpty()
  status: RefundStatus;
}
