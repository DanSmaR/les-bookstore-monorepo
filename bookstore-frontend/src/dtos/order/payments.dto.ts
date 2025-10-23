export interface PaymentDTO {
  cardId: string
  amountInCents: number
}

export interface PaymentsDTO {
  payments: PaymentDTO[]
}
