import { useCallback, useEffect, useState } from 'react'

import type { OrderStatusType, RefundStatusType } from '@/dtos'
import type { RefundRequestDTO } from '@/dtos/refund'
import { useAdminOrder, useCustomer } from '@/hooks'
import { formatCurrency, formatDateTime } from '@/utils'

interface CustomerOrdersFilters {
  searchTerm: string
  statusFilter: string
  startDate: string
  endDate: string
}

export const useCustomerOrders = (customerId: string) => {
  const { getCustomerById } = useCustomer()
  const adminOrder = useAdminOrder(customerId)

  const [filters, setFilters] = useState<CustomerOrdersFilters>({
    searchTerm: '',
    statusFilter: '',
    startDate: '',
    endDate: '',
  })

  // Debounced search term - updates 500ms after user stops typing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [customerInfo, setCustomerInfo] = useState<{
    name: string
    email: string
  } | null>(null)

  // Debounce the search term
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm)
    }, 500)

    return () => window.clearTimeout(timeoutId)
  }, [filters.searchTerm])

  // Load customer info
  useEffect(() => {
    const loadCustomerInfo = async () => {
      try {
        const result = await getCustomerById(customerId)
        if (result.success && result.data) {
          setCustomerInfo({
            name: result.data.name,
            email: result.data.email,
          })
        }
      } catch {
        // Handle error silently or show user-friendly message
      }
    }

    if (customerId) {
      loadCustomerInfo()
    }
  }, [customerId, getCustomerById])

  // Load orders when filters change
  useEffect(() => {
    if (!customerId) return

    const params = {
      page: adminOrder.currentPage,
      pageSize: adminOrder.pageSize,
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(filters.statusFilter && { status: filters.statusFilter }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    }

    adminOrder.fetchOrders(params)
  }, [
    customerId,
    debouncedSearchTerm,
    filters.statusFilter,
    filters.startDate,
    filters.endDate,
    adminOrder.currentPage,
    adminOrder.pageSize,
  ])

  // Action handlers using adminOrder hook
  const setSearchTerm = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, searchTerm: value }))
      adminOrder.goToPage(1) // Reset to first page
    },
    [adminOrder],
  )

  const setStatusFilter = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, statusFilter: value }))
      adminOrder.goToPage(1) // Reset to first page
    },
    [adminOrder],
  )

  const setStartDate = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, startDate: value }))
      adminOrder.goToPage(1) // Reset to first page
    },
    [adminOrder],
  )

  const setEndDate = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, endDate: value }))
      adminOrder.goToPage(1) // Reset to first page
    },
    [adminOrder],
  )

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: '',
      startDate: '',
      endDate: '',
    })
    adminOrder.goToPage(1)
  }, [adminOrder])

  // Order action handlers
  const handleRequestRefund = useCallback(
    async (orderId: string, refundData: RefundRequestDTO) => {
      return await adminOrder.requestRefund(orderId, refundData)
    },
    [adminOrder],
  )

  const handleChangeOrderStatus = useCallback(
    async (orderId: string, status: OrderStatusType) => {
      return await adminOrder.changeOrderStatus(orderId, status)
    },
    [adminOrder],
  )

  const handleChangeRefundStatus = useCallback(
    async (orderId: string, refundId: string, status: RefundStatusType) => {
      return await adminOrder.changeRefundStatus(orderId, refundId, status)
    },
    [adminOrder],
  )

  // Format functions
  const formatDate = useCallback((date: Date | string): string => {
    return formatDateTime(date as Date)
  }, [])

  return {
    // Data from adminOrder hook
    orders: adminOrder.orders,
    customerInfo,
    totalOrders: adminOrder.totalOrders,
    isLoading: adminOrder.isLoading,
    error: adminOrder.error,

    // Loading states
    isStatusLoading: adminOrder.isStatusLoading,
    isRefundLoading: adminOrder.isRefundLoading,

    // Pagination from adminOrder hook
    currentPage: adminOrder.currentPage,
    pageSize: adminOrder.pageSize,
    totalPages: adminOrder.totalPages,
    setCurrentPage: adminOrder.goToPage,
    setPageSize: adminOrder.changePageSize,

    // Filters
    searchTerm: filters.searchTerm,
    statusFilter: filters.statusFilter,
    startDate: filters.startDate,
    endDate: filters.endDate,
    setSearchTerm,
    setStatusFilter,
    setStartDate,
    setEndDate,
    clearFilters,

    // Actions
    refreshOrders: adminOrder.refreshOrders,
    handleRequestRefund,
    handleChangeOrderStatus,
    handleChangeRefundStatus,
    formatCurrency,
    formatDate,
  }
}
