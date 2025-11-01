import { Order } from '@/domain/order/order.entity';
import { OrderStatus } from '@/domain/order/status.enum';
import { TicketResponseDto } from '@/presentation/dtos/ticket.dto';

import { OrderItemDTO } from './order-item.dto';

export class OrderDTO {
  id: string;
  items: OrderItemDTO[];
  totalItems: number;
  subtotal: number;
  discount: number;
  orderDate: Date;
  status: OrderStatus;
  tickets: TicketResponseDto[];

  constructor(order: Order) {
    this.id = order.id;
    this.items = order.items.map((item) => new OrderItemDTO(item));
    this.totalItems = order.getTotalItems();
    this.subtotal = order.getSubtotal();
    this.discount = order.getDiscount();
    this.orderDate = order.orderDate;
    this.status = order.status;
    this.tickets = (order.tickets || []).map((ticket) => ({
      id: ticket.id,
      code: ticket.code,
      value: ticket.value,
      type: ticket.type,
      nature: ticket.nature,
      validUntil: ticket.validUntil,
      description: ticket.description,
      maxDiscount: ticket.maxDiscount,
      originOrderId: ticket.originOrderId,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }));
  }
}
