export interface CreateOrderItemDTO {
  bookId: string
  quantity: number
}

export interface CreateOrderDTO {
  items: CreateOrderItemDTO[]
  deliveryAddressId: string
}
