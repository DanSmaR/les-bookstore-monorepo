export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  price: number
  stock: number
  publisher: string
  status: 'Em estoque' | 'Fora de estoque'
}
