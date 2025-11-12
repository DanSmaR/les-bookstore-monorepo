import { useCallback, useState } from 'react'

import type { Period } from '@/dtos'
import { useAnalytics } from '@/hooks'

interface DashboardFilters {
  period: Period
  startDate: string
  endDate: string
}

export const useDashboards = () => {
  const { data, isLoading, error, getOrdersAnalytics } = useAnalytics()

  const [filters, setFilters] = useState<DashboardFilters>({
    period: 'monthly',
    startDate: '',
    endDate: '',
  })

  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const loadData = useCallback(() => {
    const params = {
      period: filters.period,
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    }
    return getOrdersAnalytics(params)
  }, [filters, getOrdersAnalytics])

  const refreshData = useCallback(() => {
    return loadData()
  }, [loadData])

  return {
    // Data
    data,
    isLoading,
    error,
    filters,

    // Actions
    updateFilters,
    loadData,
    refreshData,
  }
}
