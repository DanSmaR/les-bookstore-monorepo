import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/infrastructure/auth/guards';
import { AuthenticatedRequest } from '@/presentation/auth/interfaces';
import { TicketResponseDto } from '@/presentation/dtos/ticket.dto';

import { ValidateTicketDTO } from './dtos/validate-ticket.dto';
import { TicketsSiteWebService } from './tickets-site.webservice';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('tickets')
export class TicketsSiteController {
  constructor(private readonly webService: TicketsSiteWebService) {}

  @Get('me')
  public async getMyTickets(
    @Request() req: AuthenticatedRequest,
  ): Promise<TicketResponseDto[]> {
    const userId = req.user.userId;
    return await this.webService.getUserTickets(userId);
  }

  @Post('validate')
  public async validateTicket(
    @Body() dto: ValidateTicketDTO,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return await this.webService.validateTicket(dto, userId);
  }
}
