export interface BookDTO {
  id: string
  title: string
  author: string
  isbn: string
  description?: string
  price: number
  stock: number
  publisher?: string
  publishedDate?: Date
  imageUrl?: string
}
