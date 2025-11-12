export interface RefundRequestItemDTO {
  bookId: string
  quantity: number
}

export interface RefundRequestDTO {
  items: RefundRequestItemDTO[]
  reason?: string
}
