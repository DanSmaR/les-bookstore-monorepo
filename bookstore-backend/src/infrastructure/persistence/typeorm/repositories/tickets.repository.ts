import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TicketsRepository } from '@/application/orders/interfaces/tickets.repository';
import { TicketNature } from '@/domain/ticket/enums/ticket-nature.enum';
import { Ticket } from '@/domain/ticket/ticket.entity';

import { CRUDRepository } from './base.repository';

@Injectable()
export class TicketsRepositoryImpl
  extends CRUDRepository<Ticket>
  implements TicketsRepository
{
  constructor(@InjectRepository(Ticket) repository: Repository<Ticket>) {
    super(repository);
  }

  findByCode(code: string): Promise<Ticket | null> {
    return this.repository.findOne({ where: { code } });
  }

  findByOwnerId(ownerId: string): Promise<Ticket[]> {
    return this.repository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  findByOwnerIdAndNature(
    ownerId: string,
    nature: TicketNature,
  ): Promise<Ticket[]> {
    return this.repository.find({
      where: { ownerId, nature },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find all tickets available for a user to use
   * Returns:
   * - User's personal tickets (owner_id = userId)
   * - Public promotional tickets (owner_id IS NULL AND nature = promotional)
   */
  async findAvailableForUser(userId: string): Promise<Ticket[]> {
    // Use QueryBuilder to ensure proper OR condition handling
    const tickets = await this.repository
      .createQueryBuilder('ticket')
      .where('ticket.ownerId = :userId', { userId })
      .orWhere('(ticket.ownerId IS NULL AND ticket.nature = :promotional)', {
        promotional: TicketNature.PROMOTIONAL,
      })
      .orderBy('ticket.createdAt', 'DESC')
      .getMany();

    return tickets;
  }
}
