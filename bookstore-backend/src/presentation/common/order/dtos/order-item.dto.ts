import { OrderItem } from '@/domain/order/order-item.entity';

import { OrderBookDTO } from './order-book.dto';

export class OrderItemDTO {
  book: OrderBookDTO;
  quantity: number;
  unitPrice: number;
  totalPrice: number;

  constructor(entity: OrderItem) {
    this.book = new OrderBookDTO(entity.book);
    this.quantity = entity.quantity;
    this.unitPrice = entity.unitPrice;
    this.totalPrice = entity.getTotalPrice();
  }
}
