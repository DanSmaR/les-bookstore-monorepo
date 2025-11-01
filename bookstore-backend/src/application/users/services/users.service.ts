import { BaseService } from '@application/base.service';
import { User } from '@domain/user/user.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { TicketsService } from '@/application/orders/services/tickets.service';
import { UsersRepository } from '@/application/users/interfaces/users.repository';
import { TicketStatus } from '@/domain/ticket/enums/ticket-status.enum';
import { Ticket } from '@/domain/ticket/ticket.entity';
import { UserRole } from '@/domain/user/enums/role.enum';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => TicketsService))
    private readonly ticketsService: TicketsService,
  ) {
    super(usersRepository);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  public async findByCpf(cpf: string): Promise<User | null> {
    return this.usersRepository.findByCpf(cpf);
  }

  public async findActiveCustomerByIdOrThrow(id: string): Promise<User> {
    const user = await this.findActiveByIdOrThrow(id);
    if (user.role === UserRole.ADMIN) {
      throw new Error(`User with id ${id} is not a customer`);
    }
    return user;
  }

  public async reinstateTicketForUser(userId: string, ticket: Ticket) {
    const user = await this.findByIdOrThrow(userId);
    user.customerDetails.reinstateTicket(ticket);
    await this.usersRepository.save(user);
  }

  /**
   * Track that a user has used a public ticket (per-user usage)
   * Used for public promotional tickets that remain ACTIVE but shouldn't be reused by the same user
   */
  public async addUsedTicketForUser(
    userId: string,
    ticket: Ticket,
  ): Promise<void> {
    const user = await this.findByIdOrThrow(userId);
    user.customerDetails.addUsedTicket(ticket);
    await this.usersRepository.save(user);
  }

  public async reinstateTicketsForUser(
    userId: string,
    tickets: Ticket[],
  ): Promise<void> {
    if (!tickets || tickets.length === 0) return;

    const user = await this.findByIdOrThrow(userId);
    for (const ticket of tickets) {
      if (ticket.ownerId) {
        // Personal tickets: Reactivate globally (change status back to ACTIVE)
        ticket.status = TicketStatus.ACTIVE;
        await this.ticketsService.save(ticket);
      }
      // For all tickets: Remove from user's used tickets list
      user.customerDetails.reinstateTicket(ticket);
    }
    await this.usersRepository.save(user);
  }
}
