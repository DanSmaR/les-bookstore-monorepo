import { Select, type SelectOption } from '@/components/Select'
import type { Period } from '@/dtos'

interface PeriodSelectorProps {
  value: Period
  onChange: (period: Period) => void
  disabled?: boolean
}

const periodOptions: SelectOption[] = [
  { value: 'daily', label: 'Diário' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
]

export const PeriodSelector = ({
  value,
  onChange,
  disabled = false,
}: PeriodSelectorProps) => {
  const handleChange = (newValue: string) => {
    onChange(newValue as Period)
  }

  return (
    <Select
      label="Período"
      value={value}
      onChange={handleChange}
      options={periodOptions}
      disabled={disabled}
      data-testid="period-selector"
    />
  )
}
