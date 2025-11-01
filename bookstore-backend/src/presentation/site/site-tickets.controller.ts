import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { TicketsService } from '@/application/orders/services/tickets.service';
import { Ticket } from '@/domain/ticket/ticket.entity';
import { JwtAuthGuard } from '@/infrastructure/auth/guards/jwt-auth.guard';

import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { TicketResponseDto, ValidateTicketDto } from '../dtos/ticket.dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class SiteTicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('validate')
  async validate(@Body() dto: ValidateTicketDto): Promise<{
    valid: boolean;
    message?: string;
    ticket?: TicketResponseDto;
  }> {
    try {
      const ticket = await this.ticketsService.findByCodeOrThrow(dto.code);

      if (!ticket.isValid()) {
        return {
          valid: false,
          message: 'Cupom inválido ou expirado',
        };
      }

      return {
        valid: true,
        ticket: this.mapToResponse(ticket),
      };
    } catch {
      return {
        valid: false,
        message: 'Cupom não encontrado',
      };
    }
  }

  @Get('me')
  async getMyTickets(
    @Request() req: AuthenticatedRequest,
  ): Promise<TicketResponseDto[]> {
    const tickets = await this.ticketsService.findByOwnerId(req.user.userId);
    return tickets.map((ticket) => this.mapToResponse(ticket));
  }

  private mapToResponse(ticket: Ticket): TicketResponseDto {
    return {
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
    };
  }
}
