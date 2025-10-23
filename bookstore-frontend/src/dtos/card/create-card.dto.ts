import type { CardType } from './card-types'

export interface CreateCardDTO {
  number: string
  holderName: string
  expirationDate: Date
  type: CardType
  cvv: string
}
