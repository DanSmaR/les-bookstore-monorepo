import { Minus, Plus } from 'phosphor-react'
import React from 'react'

import * as S from './styles'

interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
}

export const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  onQuantityChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) => {
  const handleInputChange = (e: React.ChangeEvent<{ value: string }>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value)
    }
  }

  const handleInputBlur = (e: React.FocusEvent<{ value: string }>) => {
    const value = parseInt(e.target.value, 10)
    if (isNaN(value) || value < min) {
      onQuantityChange(min)
    } else if (value > max) {
      onQuantityChange(max)
    }
  }

  return (
    <S.QuantityContainer>
      <S.QuantityButton
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Diminuir quantidade"
      >
        <Minus size={16} weight="bold" />
      </S.QuantityButton>

      <S.QuantityInput
        type="number"
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        min={min}
        max={max}
        aria-label="Quantidade"
        data-testid="cart-item-quantity-input"
      />

      <S.QuantityButton
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Aumentar quantidade"
      >
        <Plus size={16} weight="bold" />
      </S.QuantityButton>
    </S.QuantityContainer>
  )
}
