import { Injectable } from '@nestjs/common';

import { TicketNature } from '@/domain/ticket/enums/ticket-nature.enum';
import { TicketStatus } from '@/domain/ticket/enums/ticket-status.enum';
import { TicketType } from '@/domain/ticket/enums/ticket-type.enum';
import { Ticket } from '@/domain/ticket/ticket.entity';

import { TicketsService } from '../services/tickets.service';

export interface GenerateExchangeTicketParams {
  userId: string;
  originOrderId: string;
  amount: number;
  reason: 'overpayment' | 'product_return';
}

@Injectable()
export class GenerateExchangeTicket {
  constructor(private readonly ticketsService: TicketsService) {}

  async execute(params: GenerateExchangeTicketParams): Promise<Ticket> {
    const code = this.generateUniqueCode();

    const ticket = new Ticket({
      code,
      value: params.amount,
      type: TicketType.RAW,
      nature: TicketNature.EXCHANGE,
      originOrderId: params.originOrderId,
      ownerId: params.userId, // Cupons de troca são sempre pessoais
      validUntil: this.calculateExpirationDate(), // Ex: 1 ano
      description: `Cupom de troca - ${params.reason === 'overpayment' ? 'Troco' : 'Devolução de produto'}`,
      status: TicketStatus.ACTIVE,
    });

    return await this.ticketsService.save(ticket);
  }

  private generateUniqueCode(): string {
    // Ex: TROCA-20251026-ABC123
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TROCA-${timestamp}-${random}`;
  }

  private calculateExpirationDate(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1); // 1 ano
    return date;
  }
}
