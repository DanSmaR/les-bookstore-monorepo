import type { BookDTO } from '../book/book.dto'

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
}

export interface CartStateDTO {
  items: CartItemDTO[]
  summary: CartSummaryDTO
  lastUpdated: Date
  isLoading: boolean
}
