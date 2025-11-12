import { TrendDown, TrendUp } from 'phosphor-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import type { ChartDataDTO } from '@/dtos'
import { formatCurrency } from '@/utils/formatters'

import * as S from './styles'

interface StatisticsCardsProps {
  data: ChartDataDTO
  isLoading?: boolean
}

interface StatCard {
  title: string
  value: string
  trend?: {
    value: number
    isPositive: boolean
  } | null
}

export const StatisticsCards = ({
  data,
  isLoading = false,
}: StatisticsCardsProps) => {
  if (isLoading) {
    return (
      <S.Container>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                <S.LoadingSkeleton />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <S.LoadingSkeleton />
              <S.LoadingSkeleton />
            </CardContent>
          </Card>
        ))}
      </S.Container>
    )
  }

  if (!data?.meta) {
    return null
  }

  const { meta } = data
  const lastDataPoint = data.data[data.data.length - 1]
  const secondLastDataPoint = data.data[data.data.length - 2]

  const calculateTrend = (current: number, previous: number) => {
    if (!previous || previous === 0) return null
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change),
      isPositive: change >= 0,
    }
  }

  const stats: StatCard[] = [
    {
      title: 'Receita Total',
      value: formatCurrency(meta.total),
      trend: secondLastDataPoint
        ? calculateTrend(
            lastDataPoint?.revenue || 0,
            secondLastDataPoint?.revenue || 0,
          )
        : null,
    },
    {
      title: 'Total de Pedidos',
      value: meta.orders.toLocaleString('pt-BR'),
      trend: secondLastDataPoint
        ? calculateTrend(
            lastDataPoint?.orderCount || 0,
            secondLastDataPoint?.orderCount || 0,
          )
        : null,
    },
    {
      title: 'Livros Vendidos',
      value: meta.count.toLocaleString('pt-BR'),
      trend: secondLastDataPoint
        ? calculateTrend(
            lastDataPoint?.salesVolume || 0,
            secondLastDataPoint?.salesVolume || 0,
          )
        : null,
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(lastDataPoint?.averageOrderValue || 0),
      trend: secondLastDataPoint
        ? calculateTrend(
            lastDataPoint?.averageOrderValue || 0,
            secondLastDataPoint?.averageOrderValue || 0,
          )
        : null,
    },
  ]

  return (
    <S.Container>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader>
            <CardTitle>{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <S.StatValue>{stat.value}</S.StatValue>
            {stat.trend && (
              <S.TrendContainer isPositive={stat.trend.isPositive}>
                {stat.trend.isPositive ? (
                  <TrendUp size={16} weight="bold" />
                ) : (
                  <TrendDown size={16} weight="bold" />
                )}
                <S.TrendText>
                  {stat.trend.isPositive ? '+' : '-'}
                  {stat.trend.value.toFixed(1)}%
                </S.TrendText>
              </S.TrendContainer>
            )}
          </CardContent>
        </Card>
      ))}
    </S.Container>
  )
}
