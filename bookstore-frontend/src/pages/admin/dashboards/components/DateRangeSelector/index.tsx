import { Input } from '@/components'

import * as S from './styles'

interface DateRangeSelectorProps {
  startDate?: string
  endDate?: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  disabled?: boolean
}

export const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabled = false,
}: DateRangeSelectorProps) => {
  return (
    <S.Container>
      <Input
        type="date"
        label="Data Inicial"
        value={startDate || ''}
        onChange={(e) => onStartDateChange(e.target.value)}
        disabled={disabled}
        data-testid="start-date-input"
      />
      <Input
        type="date"
        label="Data Final"
        value={endDate || ''}
        onChange={(e) => onEndDateChange(e.target.value)}
        disabled={disabled}
        data-testid="end-date-input"
      />
    </S.Container>
  )
}
