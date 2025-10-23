import { Order } from '@/domain/order/order.entity';
import { OrderStatus } from '@/domain/order/status.enum';

import { OrderItemDTO } from './order-item.dto';

export class OrderDTO {
  id: string;
  items: OrderItemDTO[];
  totalItems: number;
  totalPrice: number;
  orderDate: Date;
  status: OrderStatus;

  constructor(order: Order) {
    this.id = order.id;
    this.items = order.items.map((item) => new OrderItemDTO(item));
    this.totalItems = order.getTotalItems();
    this.totalPrice = order.getTotalPrice();
    this.orderDate = order.orderDate;
    this.status = order.status;
  }
}
