import type { CreateOrderDTO, OrderDTO, PaymentsDTO } from '@/dtos'

import { AxiosApp } from './axios-app'

/**
 * Order API Service
 * Handles all order-related API calls
 */
export class OrderService {
  /**
   * Create a new order
   * @param orderData - The order data to create
   */
  static async createOrder(orderData: CreateOrderDTO): Promise<OrderDTO> {
    const response = await AxiosApp.post<OrderDTO>('/orders', orderData)
    return response.data
  }

  /**
   * Cancel an order
   * @param orderId - The ID of the order to cancel
   */
  static async cancelOrder(orderId: string): Promise<OrderDTO> {
    const response = await AxiosApp.patch<OrderDTO>(`/orders/${orderId}/cancel`)
    return response.data
  }

  /**
   * Pay for an order
   * @param orderId - The ID of the order to pay
   * @param paymentsData - The payments data
   */
  static async payOrder(
    orderId: string,
    paymentsData: PaymentsDTO,
  ): Promise<OrderDTO> {
    const response = await AxiosApp.post<OrderDTO>(
      `/orders/${orderId}/pay`,
      paymentsData,
    )
    return response.data
  }
}
