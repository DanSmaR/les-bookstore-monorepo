import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components'
import type { Period } from '@/dtos'
import { useAnalytics } from '@/hooks'

import {
  DateRangeSelector,
  PeriodSelector,
  SalesChart,
  StatisticsCards,
} from './components'
import * as S from './styles'

// Helper function to get default date range based on period
const getDefaultDateRange = (
  period: Period,
): { startDate: string; endDate: string } => {
  const now = new Date()
  const currentYear = now.getFullYear()

  switch (period) {
    case 'daily': {
      // Last 30 days
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return {
        startDate: thirtyDaysAgo.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
      }
    }

    case 'monthly': {
      // Last 12 months (current year)
      const startOfYear = new Date(currentYear, 0, 1)
      return {
        startDate: startOfYear.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
      }
    }

    case 'yearly': {
      // Last 5 years
      const fiveYearsAgo = new Date(currentYear - 4, 0, 1)
      return {
        startDate: fiveYearsAgo.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
      }
    }

    default:
      return {
        startDate: now.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
      }
  }
}

export const Dashboards = () => {
  const { data, isLoading, error, getOrdersAnalytics } = useAnalytics()

  const [period, setPeriod] = useState<Period>('monthly')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Initialize with default dates when component mounts or period changes
  useEffect(() => {
    if (!startDate || !endDate) {
      const defaultRange = getDefaultDateRange(period)
      setStartDate(defaultRange.startDate)
      setEndDate(defaultRange.endDate)
    }
  }, [period, startDate, endDate])

  const loadData = useCallback(() => {
    // Always use dates - either user-selected or defaults
    const finalStartDate = startDate || getDefaultDateRange(period).startDate
    const finalEndDate = endDate || getDefaultDateRange(period).endDate

    const params = {
      period,
      startDate: finalStartDate,
      endDate: finalEndDate,
    }
    getOrdersAnalytics(params)
  }, [period, startDate, endDate, getOrdersAnalytics])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod)
    // Reset dates to defaults for new period
    const defaultRange = getDefaultDateRange(newPeriod)
    setStartDate(defaultRange.startDate)
    setEndDate(defaultRange.endDate)
  }

  const handleStartDateChange = (date: string) => {
    setStartDate(date)
  }

  const handleEndDateChange = (date: string) => {
    setEndDate(date)
  }

  const handleRefresh = () => {
    loadData()
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>Dashboard de Vendas</S.Title>
        <S.Subtitle>
          Acompanhe as métricas e performance de vendas da loja
        </S.Subtitle>
      </S.Header>

      <S.FiltersContainer>
        <S.FiltersGroup>
          <PeriodSelector
            value={period}
            onChange={handlePeriodChange}
            disabled={isLoading}
          />
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            disabled={isLoading}
          />
        </S.FiltersGroup>
        <Button
          variant="outline"
          onClick={handleRefresh}
          loading={isLoading}
          data-testid="refresh-button"
        >
          Atualizar
        </Button>
      </S.FiltersContainer>

      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

      {data && (
        <>
          <StatisticsCards data={data} isLoading={isLoading} />
          <S.ChartSection>
            <S.ChartTitle>Evolução das Vendas</S.ChartTitle>
            <SalesChart data={data} isLoading={isLoading} />
          </S.ChartSection>
        </>
      )}

      {!data && !isLoading && !error && (
        <S.EmptyState>
          <S.EmptyStateText>
            Nenhum dado encontrado. Selecione um período para visualizar as
            métricas.
          </S.EmptyStateText>
        </S.EmptyState>
      )}
    </S.Container>
  )
}
