export interface MinBookDTO {
  id: string
  title: string
  author: string
  isbn: string
  price: number
  stock: number
  publisher?: string
  imageUrl?: string
}
