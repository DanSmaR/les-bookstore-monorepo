import type { BookDTO, CreateBookDTO, MinBookDTO } from '@/dtos/book'
import type { PaginatedResultDTO } from '@/dtos/common'

import { AxiosApp } from './axios-app'

export interface GetBooksParams {
  page?: number
  pageSize?: number
  search?: string
  author?: string
  publisher?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

export interface UpdateBookData {
  title?: string
  author?: string
  isbn?: string
  description?: string
  price?: number
  stock?: number
  publisher?: string
  publishedDate?: Date
}

/**
 * Book API Service
 * Handles all book-related API calls
 */
export class BookService {
  /**
   * Get all books with pagination
   */
  static async getAllBooks(
    params: GetBooksParams = {},
  ): Promise<PaginatedResultDTO<MinBookDTO>> {
    const queryParams: string[] = []

    if (params.page) queryParams.push(`page=${params.page}`)
    if (params.pageSize) queryParams.push(`pageSize=${params.pageSize}`)
    if (params.search)
      queryParams.push(`search=${encodeURIComponent(params.search)}`)
    if (params.author)
      queryParams.push(`author=${encodeURIComponent(params.author)}`)
    if (params.publisher)
      queryParams.push(`publisher=${encodeURIComponent(params.publisher)}`)
    if (params.minPrice) queryParams.push(`minPrice=${params.minPrice}`)
    if (params.maxPrice) queryParams.push(`maxPrice=${params.maxPrice}`)
    if (params.inStock !== undefined)
      queryParams.push(`inStock=${params.inStock}`)

    const queryString = queryParams.join('&')
    const url = queryString ? `/books?${queryString}` : '/books'

    const response = await AxiosApp.get(url)
    return response.data
  }

  /**
   * Get book by ID
   */
  static async getBookById(id: string): Promise<BookDTO> {
    const response = await AxiosApp.get<BookDTO>(`/books/${id}`)
    return response.data
  }

  /**
   * Create new book
   */
  static async createBook(bookData: CreateBookDTO): Promise<BookDTO> {
    const response = await AxiosApp.post<BookDTO>('/books', bookData)
    return response.data
  }

  /**
   * Update book
   */
  static async updateBook(
    id: string,
    bookData: UpdateBookData,
  ): Promise<BookDTO> {
    const response = await AxiosApp.put<BookDTO>(`/books/${id}`, bookData)
    return response.data
  }

  /**
   * Delete book
   */
  static async deleteBook(id: string): Promise<void> {
    await AxiosApp.delete(`/books/${id}`)
  }

  /**
   * Update book stock
   */
  static async updateBookStock(id: string, stock: number): Promise<BookDTO> {
    const response = await AxiosApp.patch<BookDTO>(`/books/${id}/stock`, {
      stock,
    })
    return response.data
  }

  /**
   * Get books by author
   */
  static async getBooksByAuthor(author: string): Promise<MinBookDTO[]> {
    const response = await AxiosApp.get<MinBookDTO[]>(
      `/books/author/${encodeURIComponent(author)}`,
    )
    return response.data
  }

  /**
   * Get books by publisher
   */
  static async getBooksByPublisher(publisher: string): Promise<MinBookDTO[]> {
    const response = await AxiosApp.get<MinBookDTO[]>(
      `/books/publisher/${encodeURIComponent(publisher)}`,
    )
    return response.data
  }

  /**
   * Search books by ISBN
   */
  static async getBookByISBN(isbn: string): Promise<BookDTO> {
    const response = await AxiosApp.get<BookDTO>(`/books/isbn/${isbn}`)
    return response.data
  }
}
