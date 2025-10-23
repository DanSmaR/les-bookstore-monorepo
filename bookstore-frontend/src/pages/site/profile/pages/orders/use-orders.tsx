import { useCallback, useEffect, useState } from 'react'

import { useOrder } from '@/hooks'
import { useAuth, useToast } from '@/providers'
import { formatCurrency, formatDateTime } from '@/utils'

interface OrderFilters {
  startDate?: Date
  endDate?: Date
  search?: string
}

export const useOrders = () => {
  const { isAuthenticated } = useAuth()
  const {
    isLoading: orderIsLoading,
    error: orderError,
    totalOrders,
    orderStatistics,
    sortedOrders,
    recentOrders,
    refreshOrders,
    cancelOrder,
    filterOrdersByDateRange,
  } = useOrder()

  const { addToast } = useToast()
  const [filters, setFilters] = useState<OrderFilters>({})
  const [filteredOrders, setFilteredOrders] = useState(sortedOrders)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasLoadError, setHasLoadError] = useState(false)

  // Apply filters when orders or filters change
  useEffect(() => {
    let filtered = [...sortedOrders]

    // Filter by date range
    if (filters.startDate && filters.endDate) {
      filtered = filterOrdersByDateRange(filters.startDate, filters.endDate)
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter((order) =>
        order.items.some(
          (item) =>
            item.book.title.toLowerCase().includes(searchTerm) ||
            item.book.author.toLowerCase().includes(searchTerm) ||
            item.book.isbn.toLowerCase().includes(searchTerm),
        ),
      )
    }

    setFilteredOrders(filtered)
  }, [sortedOrders, filters, filterOrdersByDateRange])

  // Load orders data
  const loadOrders = useCallback(async () => {
    if (!isAuthenticated) {
      addToast('Usuário não autenticado', 'error')
      return
    }

    setLoading(true)
    setHasLoadError(false) // Reset error state when starting a new load

    try {
      const result = await refreshOrders()

      if (result.success) {
        setHasLoadError(false)
        if (!hasInitialLoad) {
          setHasInitialLoad(true)
        }
      } else {
        setHasLoadError(true)
        addToast(
          'Não foi possível carregar seus pedidos. Verifique sua conexão e tente novamente.',
          'error',
        )
      }
    } catch {
      setHasLoadError(true)
      addToast(
        'Não foi possível carregar seus pedidos. Verifique sua conexão e tente novamente.',
        'error',
      )
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, refreshOrders, addToast, hasInitialLoad])

  // Initial load effect
  useEffect(() => {
    if (isAuthenticated && !hasInitialLoad) {
      setHasInitialLoad(true)
      loadOrders()
    }
  }, [isAuthenticated, hasInitialLoad, loadOrders])

  const handleRefreshOrders = useCallback(async () => {
    await loadOrders()
  }, [loadOrders])

  const handleCancelOrder = useCallback(
    async (orderId: string) => {
      try {
        const result = await cancelOrder(orderId)
        if (result.success) {
          addToast('Pedido cancelado com sucesso!', 'success')
          // Refresh orders to get updated data
          await loadOrders()
        } else {
          addToast(
            'Não foi possível cancelar o pedido. Tente novamente.',
            'error',
          )
        }
        return result
      } catch {
        addToast(
          'Não foi possível cancelar o pedido. Tente novamente.',
          'error',
        )
        return { success: false }
      }
    },
    [cancelOrder, addToast, loadOrders],
  )

  const handleFilterChange = (newFilters: Partial<OrderFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  return {
    // Loading state - true if loading or retrying or no initial load yet
    isLoading: loading || orderIsLoading || !hasInitialLoad,
    error: orderError || hasLoadError,
    orders: filteredOrders,
    totalOrders,
    orderStatistics,
    recentOrders,
    filteredOrders,
    filters,
    setFilters,
    handleFilterChange,
    clearFilters,
    formatCurrency,
    formatDate: formatDateTime,
    handleRefreshOrders,
    handleCancelOrder,
  }
}
