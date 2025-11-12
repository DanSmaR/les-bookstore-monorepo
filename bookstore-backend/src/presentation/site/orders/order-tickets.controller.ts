import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  ApplyTicketsResult,
  ApplyTicketsToOrder,
} from '@/application/orders/use-cases/apply-tickets-to-order.usecase';
import { JwtAuthGuard } from '@/infrastructure/auth/guards/jwt-auth.guard';

import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';
import { ApplyTicketsDto } from '../../dtos/ticket.dto';

/**
 * Exemplo de resposta do endpoint:
 *
 * POST /orders/:orderId/apply-tickets
 * Body: { availableTicketCodes: ["TROCA-001", "TROCA-002", "TROCA-003"] }
 *
 * Response:
 * {
 *   "success": true,
 *   "appliedTickets": [
 *     { "code": "TROCA-001", "value": 20.00, "applied": true },
 *     { "code": "TROCA-003", "value": 35.00, "applied": true }
 *   ],
 *   "removedTickets": [
 *     {
 *       "ticket": { "code": "TROCA-002", "value": 40.00 },
 *       "reason": "Combinação não otimizada (RN0036) - geraria desperdício desnecessário"
 *     }
 *   ],
 *   "invalidTickets": [],
 *   "summary": {
 *     "subtotal": 50.00,
 *     "totalDiscount": 55.00,
 *     "finalPrice": 0.00,
 *     "changeAmount": 5.00,
 *     "explanation": "Combinação otimizada selecionada automaticamente..."
 *   },
 *   "message": "O sistema selecionou automaticamente a melhor combinação de cupons (RN0036)"
 * }
 */
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderTicketsController {
  constructor(private readonly applyTicketsToOrder: ApplyTicketsToOrder) {}

  /**
   * RN0036: Sistema DECIDE automaticamente quais cupons usar.
   * Cliente informa quais cupons TEM, mas o sistema escolhe a melhor combinação.
   */
  @Post(':orderId/apply-tickets')
  async applyTickets(
    @Param('orderId') orderId: string,
    @Body() dto: ApplyTicketsDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<{
    success: boolean;
    appliedTickets: Array<{
      code: string;
      value: number;
      nature: string;
      applied: true;
    }>;
    removedTickets: Array<{
      code: string;
      value: number;
      reason: string;
      applied: false;
    }>;
    invalidTickets: string[];
    summary: {
      subtotal: number;
      totalDiscount: number;
      finalPrice: number;
      changeAmount: number;
      explanation: string;
    };
    message: string;
  }> {
    const result: ApplyTicketsResult = await this.applyTicketsToOrder.execute(
      orderId,
      dto.availableTicketCodes,
      req.user.userId, // Validar ownership dos tickets
    );

    // Formatar resposta
    return {
      success: true,
      appliedTickets: result.appliedTickets.map((ticket) => ({
        code: ticket.code,
        value: ticket.value,
        nature: ticket.nature,
        applied: true as const,
      })),
      removedTickets: result.removedTickets.map(({ ticket, reason }) => ({
        code: ticket.code,
        value: ticket.value,
        reason,
        applied: false as const,
      })),
      invalidTickets: result.invalidTickets,
      summary: {
        subtotal: 0, // TODO: pegar do order
        totalDiscount: result.optimization.totalDiscount,
        finalPrice: 0, // TODO: calcular
        changeAmount: result.optimization.changeAmount,
        explanation: result.optimization.explanation,
      },
      message:
        result.removedTickets.length > 0
          ? 'O sistema selecionou automaticamente a melhor combinação de cupons para minimizar o troco (RN0036)'
          : 'Todos os cupons foram aplicados',
    };
  }
}
