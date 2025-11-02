import { Order } from '@/domain/order/order.entity';
import { OrderStatus } from '@/domain/order/status.enum';

export interface OrderStatusChangeHandler {
  handle(order: Order, userId: string): Promise<Order>;
  getStatus(): OrderStatus;
}
