import { useCallback, useEffect, useMemo, useState } from 'react'

import type { OrderDTO, OrderStatusType } from '@/dtos'
import { OrderService, UserService } from '@/services'

interface OrderState {
  orders: OrderDTO[]
  isLoading: boolean
  error: string | null
  totalOrders: number
  currentPage: number
  pageSize: number
}

interface OrderStatistics {
  totalSpent: number
  averageOrderValue: number
  totalItems: number
}

/**
 * Order Hook
 * Manages order state and provides order-related functions
 * Fetches orders from /me/orders endpoint
 */
export const useOrder = () => {
  const [orderState, setOrderState] = useState<OrderState>({
    orders: [],
    isLoading: false,
    error: null,
    totalOrders: 0,
    currentPage: 1,
    pageSize: 10,
  })

  /**
   * Fetch user orders from API
   */
  const fetchOrders = useCallback(async (page = 1, pageSize = 10) => {
    setOrderState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await UserService.getUserOrders({ page, pageSize })

      setOrderState({
        orders: response.items,
        isLoading: false,
        error: null,
        totalOrders: response.totalCount,
        currentPage: page,
        pageSize,
      })

      return { success: true, data: response }
    } catch {
      const errorMessage = 'Erro ao carregar pedidos'

      setOrderState((prev) => ({
        ...prev,
        orders: [],
        isLoading: false,
        error: errorMessage,
        totalOrders: 0,
      }))

      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Load orders on mount
   */
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  /**
   * Calculate order statistics
   */
  const orderStatistics: OrderStatistics = useMemo(() => {
    const orders = Array.isArray(orderState.orders) ? orderState.orders : []

    if (!orders.length) {
      return {
        totalSpent: 0,
        averageOrderValue: 0,
        totalItems: 0,
      }
    }

    // Filter out pending and cancelled orders for statistics
    const completedOrders = orders.filter(
      (order) => order.status !== 'pending' && order.status !== 'cancelled',
    )

    if (!completedOrders.length) {
      return {
        totalSpent: 0,
        averageOrderValue: 0,
        totalItems: 0,
      }
    }

    const totalSpent = completedOrders.reduce((sum, order) => {
      // Calculate total price from subtotal - discount
      const subtotal =
        typeof order.subtotal === 'string'
          ? parseFloat(order.subtotal)
          : order.subtotal || 0
      const discount =
        typeof order.discount === 'string'
          ? parseFloat(order.discount)
          : order.discount || 0
      const totalPrice = subtotal - discount

      return sum + (isNaN(totalPrice) ? 0 : totalPrice)
    }, 0)

    const totalItems = completedOrders.reduce((sum, order) => {
      const items =
        typeof order.totalItems === 'string'
          ? parseInt(order.totalItems)
          : order.totalItems
      return sum + (isNaN(items) ? 0 : items)
    }, 0)

    const averageOrderValue = totalSpent / completedOrders.length

    return {
      totalSpent,
      averageOrderValue,
      totalItems,
    }
  }, [orderState.orders])

  /**
   * Get orders sorted by date (newest first)
   */
  const getSortedOrders = useMemo(() => {
    const orders = Array.isArray(orderState.orders) ? orderState.orders : []
    return orders
      .slice()
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
      )
  }, [orderState.orders])

  /**
   * Filter orders by date range
   */
  const filterOrdersByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      const orders = Array.isArray(orderState.orders) ? orderState.orders : []
      return orders.filter((order) => {
        const orderDate = new Date(order.orderDate)
        return orderDate >= startDate && orderDate <= endDate
      })
    },
    [orderState.orders],
  )

  /**
   * Get recent orders (last 30 days)
   */
  const getRecentOrders = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const orders = Array.isArray(orderState.orders) ? orderState.orders : []
    return orders.filter((order) => new Date(order.orderDate) >= thirtyDaysAgo)
  }, [orderState.orders])

  /**
   * Refresh orders data
   */
  const refreshOrders = async () => {
    return await fetchOrders()
  }

  /**
   * Cancel an order
   */
  const cancelOrder = useCallback(
    async (orderId: string) => {
      try {
        await OrderService.cancelOrder(orderId)
        // Refresh orders data to get updated orders
        await fetchOrders()
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    },
    [fetchOrders],
  )

  /**
   * Change order status
   */
  const changeOrderStatus = useCallback(
    async (orderId: string, status: OrderStatusType) => {
      try {
        await OrderService.changeOrderStatus(orderId, { status })
        // Refresh orders data to get updated orders
        await fetchOrders()
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    },
    [fetchOrders],
  )

  // Pagination helper methods
  const goToPage = useCallback(
    (page: number) => {
      fetchOrders(page, orderState.pageSize)
    },
    [fetchOrders, orderState.pageSize],
  )

  const changePageSize = useCallback(
    (pageSize: number) => {
      fetchOrders(1, pageSize) // Reset to first page when changing page size
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

    // Pagination state
    currentPage: orderState.currentPage,
    pageSize: orderState.pageSize,
    totalPages,

    // Computed data
    orderStatistics,
    sortedOrders: getSortedOrders,
    recentOrders: getRecentOrders,

    // Actions
    refreshOrders,
    cancelOrder,
    changeOrderStatus,
    filterOrdersByDateRange,

    // Pagination actions
    goToPage,
    changePageSize,
  }
}
