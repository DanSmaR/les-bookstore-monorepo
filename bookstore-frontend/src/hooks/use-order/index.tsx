import { useCallback, useMemo } from 'react'

import type { OrderDTO } from '@/dtos'
import { OrderService } from '@/services'

import { useUser } from '../use-user'

interface OrderState {
  orders: OrderDTO[]
  isLoading: boolean
  error: string | null
  totalOrders: number
}

interface OrderStatistics {
  totalSpent: number
  averageOrderValue: number
  totalItems: number
}

/**
 * Order Hook
 * Manages order state and provides order-related functions
 * Works with user data since orders come along with user information
 */
export const useOrder = () => {
  const { user, isUserLoading, userError, getCurrentUser } = useUser()

  const orderState: OrderState = useMemo(
    () => ({
      orders: user?.orders || [],
      isLoading: isUserLoading,
      error: userError,
      totalOrders: user?.orders?.length || 0,
    }),
    [user?.orders, isUserLoading, userError],
  )

  /**
   * Calculate order statistics
   */
  const orderStatistics: OrderStatistics = useMemo(() => {
    const orders = orderState.orders

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
    return [...orderState.orders].sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
    )
  }, [orderState.orders])

  /**
   * Filter orders by date range
   */
  const filterOrdersByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return orderState.orders.filter((order) => {
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

    return orderState.orders.filter(
      (order) => new Date(order.orderDate) >= thirtyDaysAgo,
    )
  }, [orderState.orders])

  /**
   * Refresh orders data
   */
  const refreshOrders = async () => {
    return await getCurrentUser()
  }

  /**
   * Cancel an order
   */
  const cancelOrder = useCallback(
    async (orderId: string) => {
      try {
        await OrderService.cancelOrder(orderId)
        // Refresh user data to get updated orders
        await getCurrentUser()
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    },
    [getCurrentUser],
  )

  return {
    // State
    orders: orderState.orders,
    isLoading: orderState.isLoading,
    error: orderState.error,
    totalOrders: orderState.totalOrders,

    // Computed data
    orderStatistics,
    sortedOrders: getSortedOrders,
    recentOrders: getRecentOrders,

    // Actions
    refreshOrders,
    cancelOrder,
    filterOrdersByDateRange,
  }
}
