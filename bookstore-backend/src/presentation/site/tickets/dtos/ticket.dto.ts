import { Ticket } from '@/domain/ticket/ticket.entity';

export class TicketDTO {
  id: string;
  code: string;
  discountAmount: number;
  finalOrderValue: number;
  description?: string;

  constructor(props: { entity: Ticket; orderValue: number }) {
    const { entity, orderValue } = props;
    this.id = entity.id;
    this.code = entity.code;
    this.discountAmount = entity.applyTicket(orderValue);
    this.finalOrderValue = orderValue - this.discountAmount;
    this.description = entity.description;
  }
}
