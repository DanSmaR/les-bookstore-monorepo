import type {
  ApplyTicketsResultDTO,
  TicketDTO,
  ValidateTicketDTO,
} from '@/dtos'

import { AxiosApp } from './axios-app'

/**
 * Ticket API Service
 * Handles all ticket-related API calls
 */
export class TicketService {
  /**
   * Get user's available tickets
   */
  static async getUserTickets(): Promise<TicketDTO[]> {
    const response = await AxiosApp.get<TicketDTO[]>('/tickets/me')
    return response.data
  }

  /**
   * Apply tickets to an order
   * @param orderId - The order ID
   * @param ticketCodes - Array of ticket codes to apply
   */
  static async applyTicketsToOrder(
    orderId: string,
    ticketCodes: string[],
  ): Promise<ApplyTicketsResultDTO> {
    const response = await AxiosApp.post<ApplyTicketsResultDTO>(
      `/orders/${orderId}/apply-tickets`,
      { availableTicketCodes: ticketCodes },
    )
    return response.data
  }

  /**
   * Validate a ticket code with current order value
   * @param ticketCode - The ticket code to validate
   * @param orderValue - The current order total value
   */
  static async validateTicket(
    ticketCode: string,
    orderValue: number,
  ): Promise<TicketDTO> {
    const payload = {
      code: ticketCode,
      orderValue,
    } as ValidateTicketDTO

    const response = await AxiosApp.post<TicketDTO>(
      '/tickets/validate',
      payload,
    )

    return response.data
  }
}
