import { BaseRepository } from '@/application/base.repository';
import { TicketNature } from '@/domain/ticket/enums/ticket-nature.enum';
import { Ticket } from '@/domain/ticket/ticket.entity';

export interface TicketsRepository extends BaseRepository<Ticket> {
  findByCode(code: string): Promise<Ticket | null>;
  findByOwnerId(ownerId: string): Promise<Ticket[]>;
  findByOwnerIdAndNature(
    ownerId: string,
    nature: TicketNature,
  ): Promise<Ticket[]>;
  findAvailableForUser(userId: string): Promise<Ticket[]>;
}
