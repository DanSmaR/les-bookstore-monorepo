import { Injectable } from '@nestjs/common';

import { TicketsService } from '@/application/orders/services/tickets.service';
import { ValidateTicket } from '@/application/orders/use-cases/tickets/validate-ticket.usecase';
import { UsersService } from '@/application/users/services/users.service';
import { TicketResponseDto } from '@/presentation/dtos/ticket.dto';

import { TicketDTO } from './dtos/ticket.dto';
import { ValidateTicketDTO } from './dtos/validate-ticket.dto';

@Injectable()
export class TicketsSiteWebService {
  constructor(
    private readonly service: TicketsService,
    private readonly validateTicketUseCase: ValidateTicket,
    private readonly usersService: UsersService,
  ) {}

  public async getUserTickets(userId: string): Promise<TicketResponseDto[]> {
    // Get user to check used tickets
    const user = await this.usersService.findByIdOrThrow(userId);

    // Get both personal tickets and public promotional tickets
    const tickets = await this.service.findAvailableForUser(userId);

    // Filter to only active (valid) tickets that the user hasn't used yet
    const availableTickets = tickets.filter((ticket) => {
      // Check if ticket is valid (not expired, not used globally)
      if (!ticket.isValid()) return false;

      // Check if user has already used this ticket (per-user tracking)
      if (user.customerDetails.hasUsedTicket(ticket)) return false;

      return true;
    });

    // Map to TicketResponseDto
    return availableTickets.map((ticket) => ({
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

  public async validateTicket(
    dto: ValidateTicketDTO,
    userId: string,
  ): Promise<TicketDTO> {
    const ticket = await this.validateTicketUseCase.execute(dto.code, userId);
    return new TicketDTO({ entity: ticket, orderValue: dto.orderValue });
  }
}
