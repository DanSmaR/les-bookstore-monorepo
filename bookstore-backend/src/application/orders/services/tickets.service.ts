import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { BaseService } from '@/application/base.service';
import { TicketNature } from '@/domain/ticket/enums/ticket-nature.enum';
import { TicketStatus } from '@/domain/ticket/enums/ticket-status.enum';
import { Ticket } from '@/domain/ticket/ticket.entity';

import { TicketsRepository } from '../interfaces/tickets.repository';

@Injectable()
export class TicketsService extends BaseService<Ticket> {
  constructor(
    @Inject('TicketsRepository')
    private readonly repository: TicketsRepository,
  ) {
    super(repository);
  }

  public async findByCode(code: string): Promise<Ticket | null> {
    return this.repository.findByCode(code);
  }

  public async findByCodeOrThrow(code: string): Promise<Ticket> {
    const ticket = await this.findByCode(code);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  public async findByOwnerId(ownerId: string): Promise<Ticket[]> {
    return this.repository.findByOwnerId(ownerId);
  }

  public async findExchangeTicketsByUserId(userId: string): Promise<Ticket[]> {
    return this.repository.findByOwnerIdAndNature(
      userId,
      TicketNature.EXCHANGE,
    );
  }

  /**
   * Find all tickets available for a user to use
   * Includes:
   * - User's personal tickets (owner_id = userId)
   * - Public promotional tickets (owner_id IS NULL AND nature = promotional)
   */
  public async findAvailableForUser(userId: string): Promise<Ticket[]> {
    return this.repository.findAvailableForUser(userId);
  }

  public async markAsUsed(ticket: Ticket): Promise<Ticket> {
    // Cupons têm uso único - sempre marcam como USED
    ticket.status = TicketStatus.USED;
    return await this.save(ticket);
  }

  public async deactivate(ticketId: string): Promise<Ticket> {
    const ticket = await this.findByIdOrThrow(ticketId, 'Ticket');
    ticket.status = TicketStatus.EXPIRED;
    return await this.save(ticket);
  }
}
