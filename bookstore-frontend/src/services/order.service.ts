import type {
  ChangeOrderStatusDTO,
  CreateOrderDTO,
  OrderDTO,
  PaymentsDTO,
} from '@/dtos'
import { OrderStatus } from '@/dtos'

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
   * Change order status
   * @param orderId - The ID of the order to update
   * @param statusData - The status change data
   */
  static async changeOrderStatus(
    orderId: string,
    statusData: ChangeOrderStatusDTO,
  ): Promise<OrderDTO> {
    const response = await AxiosApp.patch<OrderDTO>(
      `/orders/${orderId}`,
      statusData,
    )
    return response.data
  }

  /**
   * Cancel an order
   * @param orderId - The ID of the order to cancel
   */
  static async cancelOrder(orderId: string): Promise<OrderDTO> {
    return this.changeOrderStatus(orderId, { status: OrderStatus.CANCELLED })
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
