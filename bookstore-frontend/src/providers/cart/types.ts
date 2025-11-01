import type { ReactNode } from 'react'

import type {
  ApplyTicketsResultDTO,
  BookDTO,
  CartItemDTO,
  CartStateDTO,
  CartSummaryDTO,
  TicketDTO,
} from '@/dtos'

export interface CartContextValue {
  // State
  items: CartItemDTO[]
  summary: CartSummaryDTO
  isLoading: boolean
  lastUpdated: Date
  selectedTickets: TicketDTO[]
  appliedTicketsResult?: ApplyTicketsResultDTO

  // Computed properties
  isEmpty: boolean
  totalItems: number
  totalPrice: number
  totalUniqueItems: number

  // Cart operations
  addItem: (book: BookDTO, quantity?: number) => void
  removeItem: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
  getItem: (bookId: string) => CartItemDTO | undefined
  hasItem: (bookId: string) => boolean

  // Ticket operations
  selectTickets: (tickets: TicketDTO[]) => void
  clearSelectedTickets: () => void
  toggleTicketSelection: (ticket: TicketDTO) => void

  // Checkout operations
  checkout: (deliveryAddressId: string) => Promise<{
    success: boolean
    orderId?: string
    error?: string
  }>

  // Utility methods
  refreshSummary: () => void
}

export interface CartProviderProps {
  children: ReactNode
}

export interface CartState extends CartStateDTO {}
