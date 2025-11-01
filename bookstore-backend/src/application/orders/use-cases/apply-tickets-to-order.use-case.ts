import { BadRequestException, Injectable } from '@nestjs/common';

import { TicketNature } from '@/domain/ticket/enums/ticket-nature.enum';
import { Ticket } from '@/domain/ticket/ticket.entity';

import { OrdersService } from '../services/orders.service';
import { TicketsService } from '../services/tickets.service';

export interface ApplyTicketsResult {
  appliedTickets: Ticket[];
  removedTickets: Array<{ ticket: Ticket; reason: string }>;
  invalidTickets: string[];
  optimization: {
    explanation: string;
    changeAmount: number;
    totalDiscount: number;
  };
}

@Injectable()
export class ApplyTicketsToOrder {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * RN0036: Sistema DECIDE automaticamente quais cupons usar.
   * Cliente informa quais cupons TEM, sistema escolhe a melhor combinação.
   */
  async execute(
    orderId: string,
    availableTicketCodes: string[],
    userId: string,
  ): Promise<ApplyTicketsResult> {
    const order = await this.ordersService.findByIdOrThrow(orderId);

    const validTickets: Ticket[] = [];
    const invalidTickets: string[] = [];

    // 1. Validar e carregar todos os tickets disponíveis
    for (const code of availableTicketCodes) {
      try {
        const ticket = await this.ticketsService.findByCodeOrThrow(code);

        if (!ticket.isValid()) {
          invalidTickets.push(code);
          continue;
        }

        // Validar se o usuário pode usar este ticket
        if (!ticket.canBeUsedBy(userId)) {
          invalidTickets.push(code);
          continue;
        }

        validTickets.push(ticket);
      } catch {
        invalidTickets.push(code);
      }
    }

    // 2. Separar por tipo
    const promotional = validTickets.filter(
      (t) => t.nature === TicketNature.PROMOTIONAL,
    );
    const exchange = validTickets.filter(
      (t) => t.nature === TicketNature.EXCHANGE,
    );

    // 3. RN0033: Validar apenas 1 cupom promocional
    if (promotional.length > 1) {
      throw new BadRequestException(
        'Apenas um cupom promocional pode ser usado por compra (RN0033)',
      );
    }

    // 4. RN0036: OTIMIZAÇÃO FORÇADA - Sistema decide automaticamente
    const orderValue = order.getSubtotal();
    const optimization = this.optimizeExchangeTickets(
      exchange,
      orderValue,
      promotional[0], // considerar desconto promocional
    );

    // 5. Aplicar APENAS os tickets otimizados (não todos os disponíveis)
    const selectedTickets = [...promotional, ...optimization.selected];
    order.tickets = selectedTickets;
    await this.ordersService.save(order);

    // 6. Preparar lista de tickets removidos
    const removedTickets = optimization.removed.map((ticket) => ({
      ticket,
      reason:
        'Combinação não otimizada (RN0036) - geraria desperdício desnecessário',
    }));

    return {
      appliedTickets: selectedTickets,
      removedTickets,
      invalidTickets,
      optimization: {
        explanation: optimization.explanation,
        changeAmount: optimization.changeAmount,
        totalDiscount: this.calculateTotalDiscount(selectedTickets, orderValue),
      },
    };
  }

  /**
   * RN0036: Otimização FORÇADA para não desperdiçar cupons.
   * Sistema decide automaticamente qual combinação usar.
   *
   * Exemplo: R$50 de compra, cupons [R$20, R$40, R$35]
   * Resultado: usa [R$20, R$35] automaticamente, remove [R$40]
   * Gera troco de R$5
   */
  private optimizeExchangeTickets(
    tickets: Ticket[],
    orderValue: number,
    promotionalTicket?: Ticket,
  ): {
    selected: Ticket[];
    removed: Ticket[];
    changeAmount: number;
    explanation: string;
  } {
    // Descontar o promocional primeiro
    let remainingValue = orderValue;
    if (promotionalTicket) {
      remainingValue -= promotionalTicket.applyTicket(orderValue);
    }

    // Se não há valor restante, não precisa usar cupons de troca
    if (remainingValue <= 0) {
      return {
        selected: [],
        removed: tickets,
        changeAmount: 0,
        explanation:
          'Cupom promocional já cobriu todo o valor da compra. Cupons de troca não serão utilizados.',
      };
    }

    // Se não há cupons de troca, retorna vazio
    if (tickets.length === 0) {
      return {
        selected: [],
        removed: [],
        changeAmount: 0,
        explanation: 'Nenhum cupom de troca disponível',
      };
    }

    // Se só tem 1 cupom, usa ele
    if (tickets.length === 1) {
      const ticket = tickets[0];
      const ticketValue = ticket.value;
      const changeAmount = Math.max(0, ticketValue - remainingValue);

      return {
        selected: [ticket],
        removed: [],
        changeAmount,
        explanation: `Apenas 1 cupom disponível (${ticket.code}). ${
          changeAmount > 0
            ? `Troco de R$ ${changeAmount.toFixed(2)} será gerado.`
            : ''
        }`,
      };
    }

    // Algoritmo de otimização: encontrar melhor combinação
    const bestCombination = this.findBestCombination(tickets, remainingValue);

    const selectedCodes = bestCombination.map((t) => t.code).join(', ');
    const removedTickets = tickets.filter((t) => !bestCombination.includes(t));
    const totalValue = bestCombination.reduce((sum, t) => sum + t.value, 0);
    const changeAmount = Math.max(0, totalValue - remainingValue);

    return {
      selected: bestCombination,
      removed: removedTickets,
      changeAmount,
      explanation: `Combinação otimizada selecionada automaticamente (RN0036): ${selectedCodes}. Total: R$ ${totalValue.toFixed(2)}. ${
        changeAmount > 0
          ? `Troco de R$ ${changeAmount.toFixed(2)} será gerado em novo cupom.`
          : 'Valor exato da compra.'
      }${
        removedTickets.length > 0
          ? ` Cupons removidos para evitar desperdício: ${removedTickets.map((t) => t.code).join(', ')}.`
          : ''
      }`,
    };
  }

  /**
   * Encontra a melhor combinação de cupons que:
   * - Cobre o valor ou chega mais próximo
   * - Minimiza o troco gerado (RN0036)
   * - Usa o menor número de cupons (desempate)
   */
  private findBestCombination(
    tickets: Ticket[],
    targetValue: number,
  ): Ticket[] {
    let bestCombo: Ticket[] = [];
    let minWaste = Infinity;

    // Gerar todas as combinações possíveis (2^n - 1, exceto vazio)
    const n = tickets.length;

    for (let mask = 1; mask < 1 << n; mask++) {
      const combo: Ticket[] = [];
      let sum = 0;

      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) {
          combo.push(tickets[i]);
          sum += tickets[i].value;
        }
      }

      // RN0036: Só considerar combinações que cobrem pelo menos o valor
      if (sum >= targetValue) {
        const waste = sum - targetValue;

        // Critérios de seleção (em ordem de prioridade):
        // 1. Menor desperdício (troco)
        // 2. Menor número de cupons (desempate)
        const isBetter =
          waste < minWaste ||
          (waste === minWaste && combo.length < bestCombo.length);

        if (isBetter) {
          minWaste = waste;
          bestCombo = combo;
        }
      }
    }

    // Se nenhuma combinação cobre completamente, usar todos
    if (bestCombo.length === 0) {
      bestCombo = tickets;
    }

    return bestCombo;
  }

  private calculateTotalDiscount(
    tickets: Ticket[],
    orderValue: number,
  ): number {
    return tickets.reduce((sum, ticket) => {
      return sum + ticket.applyTicket(orderValue);
    }, 0);
  }
}
