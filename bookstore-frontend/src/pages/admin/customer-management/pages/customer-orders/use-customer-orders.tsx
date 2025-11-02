import { useCallback, useEffect, useMemo, useState } from 'react'

import type { OrderDTO } from '@/dtos'
import { useCustomer } from '@/hooks'
import { useToast } from '@/providers'
import { UserService } from '@/services'
import { formatCurrency, formatDateTime } from '@/utils'

interface CustomerOrdersState {
  orders: OrderDTO[]
  isLoading: boolean
  error: string | null
  totalOrders: number
  currentPage: number
  pageSize: number
}

interface CustomerOrdersFilters {
  searchTerm: string
  statusFilter: string
  startDate: string
  endDate: string
}

export const useCustomerOrders = (customerId: string) => {
  const { getCustomerById } = useCustomer()
  const { addToast } = useToast()

  const [state, setState] = useState<CustomerOrdersState>({
    orders: [],
    isLoading: false,
    error: null,
    totalOrders: 0,
    currentPage: 1,
    pageSize: 10,
  })

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

  // Load orders data with filters and pagination
  const loadOrders = useCallback(async () => {
    if (!customerId) {
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const params = {
        page: state.currentPage,
        pageSize: state.pageSize,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(filters.statusFilter && { status: filters.statusFilter }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      }

      const response = await UserService.getUserOrdersById(customerId, params)

      setState((prev) => ({
        ...prev,
        orders: response.items,
        totalOrders: response.totalCount,
        isLoading: false,
        error: null,
      }))
    } catch {
      const errorMessage = 'Erro ao carregar pedidos do cliente'
      setState((prev) => ({
        ...prev,
        orders: [],
        isLoading: false,
        error: errorMessage,
        totalOrders: 0,
      }))
      addToast(errorMessage, 'error')
    }
  }, [
    customerId,
    state.currentPage,
    state.pageSize,
    debouncedSearchTerm,
    filters.statusFilter,
    filters.startDate,
    filters.endDate,
    addToast,
  ])

  // Load orders when dependencies change
  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Filtered orders (client-side filtering for additional filters)
  const filteredOrders = useMemo(() => {
    const filtered = [...state.orders]

    // Additional client-side filtering can be added here if needed
    // For now, we rely on server-side filtering

    return filtered
  }, [state.orders])

  // Pagination calculations
  const totalPages = Math.ceil(state.totalOrders / state.pageSize)

  // Action handlers
  const setSearchTerm = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: value }))
    setState((prev) => ({ ...prev, currentPage: 1 })) // Reset to first page
  }, [])

  const setStatusFilter = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, statusFilter: value }))
    setState((prev) => ({ ...prev, currentPage: 1 })) // Reset to first page
  }, [])

  const setStartDate = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, startDate: value }))
    setState((prev) => ({ ...prev, currentPage: 1 })) // Reset to first page
  }, [])

  const setEndDate = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, endDate: value }))
    setState((prev) => ({ ...prev, currentPage: 1 })) // Reset to first page
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: '',
      startDate: '',
      endDate: '',
    })
    setState((prev) => ({ ...prev, currentPage: 1 }))
  }, [])

  const setCurrentPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, currentPage: page }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({
      ...prev,
      pageSize,
      currentPage: 1, // Reset to first page when changing page size
    }))
  }, [])

  const refreshOrders = useCallback(async () => {
    await loadOrders()
  }, [loadOrders])

  // Format functions
  const formatDate = useCallback((date: Date | string): string => {
    return formatDateTime(date as Date)
  }, [])

  return {
    // Data
    orders: filteredOrders,
    customerInfo,
    totalOrders: state.totalOrders,
    isLoading: state.isLoading,
    error: state.error,

    // Pagination
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    totalPages,
    setCurrentPage,
    setPageSize,

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
    refreshOrders,
    formatCurrency,
    formatDate,
  }
}
