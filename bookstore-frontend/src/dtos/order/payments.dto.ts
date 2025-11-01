export interface PaymentDTO {
  cardId: string
  amount: number
}

export interface PaymentsDTO {
  payments: PaymentDTO[]
}
