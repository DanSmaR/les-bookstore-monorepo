import type { BookDTO } from '../book/book.dto'
import type { ApplyTicketsResultDTO, TicketDTO } from '../ticket'

export interface CartItemDTO {
  bookId: string
  book: BookDTO
  quantity: number
  addedAt: Date
}

export interface CartSummaryDTO {
  totalItems: number
  totalPrice: number
  totalUniqueItems: number
  originalPrice?: number
  discount?: number
}

export interface CartStateDTO {
  items: CartItemDTO[]
  summary: CartSummaryDTO
  lastUpdated: Date
  isLoading: boolean
  selectedTickets: TicketDTO[]
  appliedTicketsResult?: ApplyTicketsResultDTO
}
