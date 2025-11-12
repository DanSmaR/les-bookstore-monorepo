import { RefundStatus } from '@/domain/order/enums/refund-status.enum';
import { Order } from '@/domain/order/order.entity';
import { Refund } from '@/domain/order/refund.entity';

export interface RefundStatusChangeHandler {
  handle(refund: Refund, userId: string, order?: Order): Promise<Refund>;
  getStatus(): RefundStatus;
}
