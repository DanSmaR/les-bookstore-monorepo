import { OrderStatus } from '@/domain/order/enums/status.enum';
import { Order } from '@/domain/order/order.entity';

export interface OrderStatusChangeHandler {
  handle(order: Order, userId: string): Promise<Order>;
  getStatus(): OrderStatus;
}
