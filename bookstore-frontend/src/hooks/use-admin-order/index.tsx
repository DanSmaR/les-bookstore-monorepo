import { useCallback, useState } from 'react'

import type { OrderDTO, OrderStatusType, RefundStatusType } from '@/dtos'
import type { RefundRequestDTO } from '@/dtos/refund'
import { useToast } from '@/providers'
import { type GetOrdersParams, UserService } from '@/services'

interface AdminOrderState {
  orders: OrderDTO[]
  isLoading: boolean
  error: string | null
  totalOrders: number
  currentPage: number
  pageSize: number
}

/**
 * Admin Order Hook
 * Manages order state and provides order-related functions for admin users
 * Uses UserService endpoints for admin operations on user orders
 */
export const useAdminOrder = (userId: string) => {
  const [orderState, setOrderState] = useState<AdminOrderState>({
    orders: [],
    isLoading: false,
    error: null,
    totalOrders: 0,
    currentPage: 1,
    pageSize: 10,
  })

  const [isStatusLoading, setIsStatusLoading] = useState(false)
  const [isRefundLoading, setIsRefundLoading] = useState(false)
  const { showSuccess, showError } = useToast()

  /**
   * Fetch user orders by ID (Admin operation)
   */
  const fetchOrders = useCallback(
    async (params: GetOrdersParams = {}) => {
      setOrderState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await UserService.getUserOrdersById(userId, params)

        setOrderState({
          orders: response.items,
          isLoading: false,
          error: null,
          totalOrders: response.totalCount,
          currentPage: params.page || 1,
          pageSize: params.pageSize || 10,
        })

        return { success: true, data: response }
      } catch {
        const errorMessage = 'Erro ao carregar pedidos do usuário'

        setOrderState((prev) => ({
          ...prev,
          orders: [],
          isLoading: false,
          error: errorMessage,
          totalOrders: 0,
        }))

        return { success: false, error: errorMessage }
      }
    },
    [userId],
  )

  /**
   * Change order status for a user (Admin)
   */
  const changeOrderStatus = useCallback(
    async (orderId: string, status: OrderStatusType) => {
      setIsStatusLoading(true)
      try {
        await UserService.changeUserOrderStatus(userId, orderId, { status })
        await fetchOrders({
          page: orderState.currentPage,
          pageSize: orderState.pageSize,
        })
        showSuccess('O status do pedido foi atualizado com sucesso.')
        return { success: true }
      } catch (error) {
        showError(
          'Não foi possível atualizar o status do pedido. Tente novamente.',
        )
        return { success: false, error }
      } finally {
        setIsStatusLoading(false)
      }
    },
    [
      userId,
      fetchOrders,
      orderState.currentPage,
      orderState.pageSize,
      showSuccess,
      showError,
    ],
  )

  /**
   * Request a refund for a user's order (Admin)
   */
  const requestRefund = useCallback(
    async (orderId: string, refundData: RefundRequestDTO) => {
      setIsRefundLoading(true)
      try {
        await UserService.requestUserOrderRefund(userId, orderId, refundData)
        await fetchOrders({
          page: orderState.currentPage,
          pageSize: orderState.pageSize,
        })
        showSuccess('Solicitação de reembolso criada com sucesso.')
        return { success: true }
      } catch (error) {
        showError('Não foi possível solicitar o reembolso. Tente novamente.')
        return { success: false, error }
      } finally {
        setIsRefundLoading(false)
      }
    },
    [
      userId,
      fetchOrders,
      orderState.currentPage,
      orderState.pageSize,
      showSuccess,
      showError,
    ],
  )

  /**
   * Change refund status for a user's order (Admin)
   */
  const changeRefundStatus = useCallback(
    async (orderId: string, refundId: string, status: RefundStatusType) => {
      setIsRefundLoading(true)
      try {
        await UserService.changeUserOrderRefundStatus(
          userId,
          orderId,
          refundId,
          { status },
        )
        await fetchOrders({
          page: orderState.currentPage,
          pageSize: orderState.pageSize,
        })
        showSuccess('O status do reembolso foi atualizado com sucesso.')
        return { success: true }
      } catch (error) {
        showError(
          'Não foi possível atualizar o status do reembolso. Tente novamente.',
        )
        return { success: false, error }
      } finally {
        setIsRefundLoading(false)
      }
    },
    [
      userId,
      fetchOrders,
      orderState.currentPage,
      orderState.pageSize,
      showSuccess,
      showError,
    ],
  )

  /**
   * Refresh orders data
   */
  const refreshOrders = useCallback(async () => {
    return await fetchOrders({
      page: orderState.currentPage,
      pageSize: orderState.pageSize,
    })
  }, [fetchOrders, orderState.currentPage, orderState.pageSize])

  // Pagination helper methods
  const goToPage = useCallback(
    (page: number) => {
      fetchOrders({ page, pageSize: orderState.pageSize })
    },
    [fetchOrders, orderState.pageSize],
  )

  const changePageSize = useCallback(
    (pageSize: number) => {
      fetchOrders({ page: 1, pageSize }) // Reset to first page when changing page size
    },
    [fetchOrders],
  )

  const totalPages = Math.ceil(orderState.totalOrders / orderState.pageSize)

  return {
    // State
    orders: orderState.orders,
    isLoading: orderState.isLoading,
    error: orderState.error,
    totalOrders: orderState.totalOrders,

    // Loading states
    isStatusLoading,
    isRefundLoading,

    // Pagination state
    currentPage: orderState.currentPage,
    pageSize: orderState.pageSize,
    totalPages,

    // Actions
    fetchOrders,
    refreshOrders,
    changeOrderStatus,
    requestRefund,
    changeRefundStatus,

    // Pagination actions
    goToPage,
    changePageSize,
  }
}
