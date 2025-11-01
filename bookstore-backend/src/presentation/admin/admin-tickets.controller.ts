import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TicketsService } from '@/application/orders/services/tickets.service';
import { GenerateExchangeTicket } from '@/application/orders/use-cases/generate-exchange-ticket.use-case';
import { TicketNature } from '@/domain/ticket/enums/ticket-nature.enum';
import { TicketStatus } from '@/domain/ticket/enums/ticket-status.enum';
import { Ticket } from '@/domain/ticket/ticket.entity';
import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/infrastructure/auth/guards/roles.guard';

import {
  CreateExchangeTicketDto,
  CreatePromotionalTicketDto,
  TicketResponseDto,
} from '../dtos/ticket.dto';

@Controller('admin/tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminTicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly generateExchangeTicket: GenerateExchangeTicket,
  ) {}

  @Post('promotional')
  async createPromotional(
    @Body() dto: CreatePromotionalTicketDto,
  ): Promise<TicketResponseDto> {
    const ticket = new Ticket({
      code: dto.code,
      value: dto.value,
      type: dto.type,
      nature: TicketNature.PROMOTIONAL,
      validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
      description: dto.description,
      maxDiscount: dto.maxDiscount,
      status: TicketStatus.ACTIVE,
    });

    const saved = await this.ticketsService.save(ticket);
    return this.mapToResponse(saved);
  }

  @Post('exchange')
  async createExchange(
    @Body() dto: CreateExchangeTicketDto,
  ): Promise<TicketResponseDto> {
    const ticket = await this.generateExchangeTicket.execute({
      userId: dto.userId,
      originOrderId: dto.originOrderId,
      amount: dto.amount,
      reason: dto.reason,
    });

    return this.mapToResponse(ticket);
  }

  @Get()
  async findAll(): Promise<TicketResponseDto[]> {
    const result = await this.ticketsService.findAll(1, 100);
    return result.items.map((ticket) => this.mapToResponse(ticket));
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketsService.deactivate(id);
    return this.mapToResponse(ticket);
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
