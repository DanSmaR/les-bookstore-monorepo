import type { CardBrand, CardType } from './card-types'

export interface CardDTO {
  id: string
  type: CardType
  last4: string
  brand: CardBrand
  expirationMonth: number
  expirationYear: number
}
