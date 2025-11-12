import type { ChartDataDTO, Period } from '@/dtos'

import { AxiosApp } from './axios-app'

export interface GetAnalyticsParams {
  period?: Period
  startDate?: string
  endDate?: string
}

/**
 * Analytics API Service
 * Handles all analytics-related API calls
 */
export class AnalyticsService {
  /**
   * Get orders analytics data
   * @param params - Query parameters for filtering analytics
   */
  static async getOrdersAnalytics(
    params: GetAnalyticsParams = {},
  ): Promise<ChartDataDTO> {
    const queryParts: string[] = []

    if (params.period) {
      queryParts.push(`period=${encodeURIComponent(params.period)}`)
    }
    if (params.startDate) {
      queryParts.push(`startDate=${encodeURIComponent(params.startDate)}`)
    }
    if (params.endDate) {
      queryParts.push(`endDate=${encodeURIComponent(params.endDate)}`)
    }

    const queryString = queryParts.join('&')
    const url = queryString
      ? `/analytics/orders?${queryString}`
      : '/analytics/orders'

    const response = await AxiosApp.get<ChartDataDTO>(url)
    return response.data
  }
}
