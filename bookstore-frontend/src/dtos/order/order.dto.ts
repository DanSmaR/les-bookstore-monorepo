import type { TicketDTO } from '../ticket'
import type { OrderBookDTO } from './order-book.dto'
import type { RefundDTO, RefundsSummaryDTO } from './refund-summary.dto'

export interface OrderItemDTO {
  book: OrderBookDTO
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderDTO {
  id: string
  userId?: string
  items: OrderItemDTO[]
  totalItems: number
  subtotal: number
  discount: number
  orderDate: Date
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  tickets: TicketDTO[]
  refundsSummary?: RefundsSummaryDTO
  refunds?: RefundDTO[]
  canBeRefunded: boolean
}
