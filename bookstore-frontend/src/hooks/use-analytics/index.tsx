import { useCallback, useState } from 'react'

import type { ChartDataDTO } from '@/dtos'
import type { GetAnalyticsParams } from '@/services/analytics.service'
import { AnalyticsService } from '@/services/analytics.service'

interface AnalyticsState {
  data: ChartDataDTO | null
  isLoading: boolean
  error: string | null
}

/**
 * Analytics Hook
 * Manages analytics data and provides analytics-related functions
 */
export const useAnalytics = () => {
  const [analyticsState, setAnalyticsState] = useState<AnalyticsState>({
    data: null,
    isLoading: false,
    error: null,
  })

  /**
   * Get orders analytics data
   */
  const getOrdersAnalytics = useCallback(
    async (params: GetAnalyticsParams = {}) => {
      setAnalyticsState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const data = await AnalyticsService.getOrdersAnalytics(params)

        setAnalyticsState({
          data,
          isLoading: false,
          error: null,
        })

        return { success: true, data }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao buscar análises'

        setAnalyticsState({
          data: null,
          isLoading: false,
          error: errorMessage,
        })

        return { success: false, error: errorMessage }
      }
    },
    [],
  )

  /**
   * Clear analytics data
   */
  const clearAnalytics = useCallback(() => {
    setAnalyticsState({
      data: null,
      isLoading: false,
      error: null,
    })
  }, [])

  return {
    // State
    ...analyticsState,

    // Actions
    getOrdersAnalytics,
    clearAnalytics,
  }
}
