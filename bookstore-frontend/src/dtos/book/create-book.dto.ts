export interface CreateBookDTO {
  title: string
  author: string
  isbn: string
  description?: string
  price: number
  stock: number
  publisher?: string
  publishedDate?: Date
}
