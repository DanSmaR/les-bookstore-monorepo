import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from 'styled-components'

import type { ChartDataDTO } from '@/dtos'
import { formatCurrency } from '@/utils/formatters'

import * as S from './styles'

interface SalesChartProps {
  data: ChartDataDTO
  isLoading?: boolean
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
    color: string
  }>
  label?: string
}

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <S.TooltipContainer>
        <S.TooltipLabel>{`${label}`}</S.TooltipLabel>
        {payload.map((entry) => (
          <S.TooltipItem key={entry.dataKey} color={entry.color}>
            <span>{getMetricLabel(entry.dataKey)}:</span>
            <span>{formatMetricValue(entry.dataKey, entry.value)}</span>
          </S.TooltipItem>
        ))}
      </S.TooltipContainer>
    )
  }

  return null
}

const getMetricLabel = (dataKey: string): string => {
  const labels: Record<string, string> = {
    revenue: 'Receita',
    salesVolume: 'Volume de Vendas',
    orderCount: 'Pedidos',
    averageOrderValue: 'Ticket Médio',
  }
  return labels[dataKey] || dataKey
}

const formatMetricValue = (dataKey: string, value: number): string => {
  if (dataKey === 'revenue' || dataKey === 'averageOrderValue') {
    return formatCurrency(value)
  }
  return value.toLocaleString('pt-BR')
}

const formatXAxisLabel = (value: string): string => {
  // Handle different date formats
  if (value.includes('-')) {
    const parts = value.split('-')
    if (parts.length === 3) {
      // Daily format: YYYY-MM-DD
      const date = new Date(value)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      })
    } else if (parts.length === 2) {
      // Monthly format: YYYY-MM
      const [year, month] = parts
      const date = new Date(parseInt(year), parseInt(month) - 1)
      return date.toLocaleDateString('pt-BR', {
        month: 'short',
        year: 'numeric',
      })
    }
  }
  // Yearly format or fallback
  return value
}

// Helper function to fill missing dates with zero values for better chart continuity
const fillMissingDates = (
  rawData: ChartDataDTO['data'],
  period: string,
): ChartDataDTO['data'] => {
  if (!rawData.length) return rawData

  // For small datasets or when user selected custom dates, don't fill gaps
  // This prevents creating artificial data points
  if (rawData.length < 3) return rawData

  // Sort data by date
  const sortedData = [...rawData].sort((a, b) => a.key.localeCompare(b.key))

  // Only fill gaps for periods where it makes sense
  if (period === 'daily' && sortedData.length > 7) {
    // For daily data with many points, we might want to fill weekend gaps
    // But this could create misleading data, so we'll skip this for now
    return sortedData
  }

  return sortedData
}

export const SalesChart = ({ data, isLoading = false }: SalesChartProps) => {
  const theme = useTheme()

  if (isLoading) {
    return (
      <S.Container>
        <S.LoadingMessage>Carregando dados...</S.LoadingMessage>
      </S.Container>
    )
  }

  if (!data?.data?.length) {
    return (
      <S.Container>
        <S.EmptyMessage>
          Nenhum dado disponível para o período selecionado
        </S.EmptyMessage>
      </S.Container>
    )
  }

  // Process data to handle sparse dates
  const processedData = fillMissingDates(data.data, data.meta.period)

  return (
    <S.Container>
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <LineChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.CHART.GRID} />
          <XAxis
            dataKey="key"
            tickFormatter={formatXAxisLabel}
            stroke={theme.CHART.AXIS}
          />
          <YAxis
            yAxisId="currency"
            orientation="left"
            tickFormatter={(value) => formatCurrency(value)}
            stroke={theme.CHART.AXIS}
          />
          <YAxis
            yAxisId="count"
            orientation="right"
            stroke={theme.CHART.AXIS}
          />
          <Tooltip content={<ChartTooltip />} />

          {/* Revenue line - primary metric with enhanced visibility */}
          <Line
            yAxisId="currency"
            type="monotone"
            dataKey="revenue"
            stroke={theme.CHART.PRIMARY}
            strokeWidth={3}
            dot={{ fill: theme.CHART.PRIMARY, strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: theme.CHART.PRIMARY, strokeWidth: 2 }}
            connectNulls={false}
          />

          {/* Order count line - secondary metric */}
          <Line
            yAxisId="count"
            type="monotone"
            dataKey="orderCount"
            stroke={theme.CHART.SUCCESS}
            strokeWidth={2}
            dot={{ fill: theme.CHART.SUCCESS, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: theme.CHART.SUCCESS, strokeWidth: 2 }}
            connectNulls={false}
          />

          {/* Average order value - tertiary metric with dashed style */}
          <Line
            yAxisId="currency"
            type="monotone"
            dataKey="averageOrderValue"
            stroke={theme.CHART.ERROR}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: theme.CHART.ERROR, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: theme.CHART.ERROR, strokeWidth: 2 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </S.Container>
  )
}
