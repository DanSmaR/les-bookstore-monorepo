import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersService } from '@/application/users/services/users.service';
import { Ticket } from '@/domain/ticket/ticket.entity';
import { User } from '@/domain/user/user.entity';

import { TicketsService } from '../../services/tickets.service';

@Injectable()
export class ValidateTicket {
  constructor(
    private readonly service: TicketsService,
    private readonly usersService: UsersService,
  ) {}

  public async execute(code: string, user: User): Promise<Ticket>;
  public async execute(ticket: Ticket, userId: string): Promise<Ticket>;
  public async execute(ticket: Ticket, user: User): Promise<Ticket>;
  public async execute(code: string, userId: string): Promise<Ticket>;

  public async execute(
    ticket: string | Ticket,
    user: string | User,
  ): Promise<Ticket> {
    let userEntity: User;
    let ticketEntity: Ticket;
    if (typeof user === 'string') {
      userEntity = await this.usersService.findById(user);
    } else {
      userEntity = user;
    }

    if (typeof ticket === 'string') {
      ticketEntity = await this.service.findByCodeOrThrow(ticket);
    } else {
      ticketEntity = ticket;
    }
    return this.validateTicketForUser(ticketEntity, userEntity);
  }

  private validateTicketForUser(ticket: Ticket, user: User): Ticket {
    if (user.customerDetails.hasUsedTicket(ticket)) {
      throw new BadRequestException(
        'Ticket has already been used by this user',
      );
    }

    if (ticket.validUntil && ticket.validUntil < new Date()) {
      throw new BadRequestException('Ticket has expired');
    }

    return ticket;
  }
}
