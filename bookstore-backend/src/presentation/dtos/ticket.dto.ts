import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { TicketNature } from '@/domain/ticket/enums/ticket-nature.enum';
import { TicketType } from '@/domain/ticket/enums/ticket-type.enum';
import { Ticket } from '@/domain/ticket/ticket.entity';

export class CreatePromotionalTicketDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsEnum(TicketType)
  type: TicketType;

  @IsOptional()
  @IsString()
  validUntil?: string; // ISO date string

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;
}

export class CreateExchangeTicketDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  originOrderId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(['overpayment', 'product_return'])
  reason: 'overpayment' | 'product_return';
}

export class ApplyTicketsDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  availableTicketCodes: string[]; // Cliente informa quais cupons TEM, sistema decide quais USAR
}

export class ValidateTicketDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class TicketResponseDto {
  id: string;
  code: string;
  value: number;
  type: TicketType;
  nature: TicketNature;
  validUntil?: Date;
  description?: string;
  maxDiscount?: number;
  originOrderId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(ticket: Ticket) {
    this.id = ticket.id;
    this.code = ticket.code;
    this.value = ticket.value;
    this.type = ticket.type;
    this.nature = ticket.nature;
    this.validUntil = ticket.validUntil;
    this.description = ticket.description;
    this.maxDiscount = ticket.maxDiscount;
    this.originOrderId = ticket.originOrderId;
    this.status = ticket.status;
    this.createdAt = ticket.createdAt;
    this.updatedAt = ticket.updatedAt;
  }
}
