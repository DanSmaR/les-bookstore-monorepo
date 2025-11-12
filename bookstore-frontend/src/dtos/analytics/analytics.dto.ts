export type Period = 'daily' | 'monthly' | 'yearly'

export interface ChartDataPointDTO {
  key: string
}

export interface ChartMetadataDTO {
  total: number
  count: number
  orders: number
  period: Period
  currency?: string
}

export interface OrdersAnalyticsChartDataPointDTO extends ChartDataPointDTO {
  revenue: number
  salesVolume: number
  orderCount: number
  averageOrderValue: number
}

export interface ChartDataDTO {
  data: OrdersAnalyticsChartDataPointDTO[]
  meta: ChartMetadataDTO
}
