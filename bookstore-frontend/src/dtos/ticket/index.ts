export interface TicketDTO {
  id: string
  code: string
  value: number
  type: 'percentage' | 'raw'
  nature: 'promotional' | 'exchange'
  discountAmount?: number // For cart preview
  finalOrderValue?: number // For cart preview
  description?: string
  validUntil?: string
  status: 'active' | 'used' | 'expired'
  maxDiscount?: number
  originOrderId?: string
  createdAt?: string
  updatedAt?: string
}

export interface ValidateTicketDTO {
  code: string
  orderValue: number
}

export interface ApplyTicketsDTO {
  availableTicketCodes: string[]
}

export interface ApplyTicketsResultDTO {
  success: boolean
  appliedTickets: Array<{ code: string; value: number; nature: string }>
  removedTickets: Array<{ code: string; value: number; reason: string }>
  invalidTickets: string[]
  summary: {
    subtotal: number
    totalDiscount: number
    finalPrice: number
    changeAmount: number
    explanation: string
  }
  message: string
}
