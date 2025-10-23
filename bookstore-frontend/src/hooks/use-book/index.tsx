import { useCallback, useState } from 'react'

import type { BookDTO, CreateBookDTO, MinBookDTO } from '@/dtos/book'
import type { GetBooksParams, UpdateBookData } from '@/services/book.service'
import { BookService } from '@/services/book.service'

interface BookState {
  books: MinBookDTO[]
  totalCount: number
  currentPage: number
  pageSize: number
  isLoading: boolean
  error: string | null
}

interface SingleBookState {
  book: BookDTO | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

/**
 * Book Hook
 * Manages book state and provides book-related functions
 */
export const useBook = () => {
  const [bookState, setBookState] = useState<BookState>({
    books: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    isLoading: false,
    error: null,
  })

  const [singleBookState, setSingleBookState] = useState<SingleBookState>({
    book: null,
    isLoading: false,
    isSaving: false,
    error: null,
  })

  /**
   * Get all books with pagination and filters
   */
  const getBooks = useCallback(async (params: GetBooksParams = {}) => {
    setBookState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await BookService.getAllBooks(params)

      setBookState((prev) => ({
        ...prev,
        books: response.items,
        totalCount: response.totalCount,
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        isLoading: false,
      }))

      return response
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao carregar livros'
      setBookState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  /**
   * Get book by ID
   */
  const getBookById = useCallback(async (id: string) => {
    setSingleBookState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const book = await BookService.getBookById(id)

      setSingleBookState((prev) => ({
        ...prev,
        book,
        isLoading: false,
      }))

      return book
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao carregar livro'
      setSingleBookState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  /**
   * Create new book
   */
  const createBook = useCallback(
    async (bookData: CreateBookDTO) => {
      setSingleBookState((prev) => ({ ...prev, isSaving: true, error: null }))

      try {
        const newBook = await BookService.createBook(bookData)

        setSingleBookState((prev) => ({
          ...prev,
          book: newBook,
          isSaving: false,
        }))

        // Refresh the books list
        await getBooks({
          page: bookState.currentPage,
          pageSize: bookState.pageSize,
        })

        return newBook
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao criar livro'
        setSingleBookState((prev) => ({
          ...prev,
          isSaving: false,
          error: errorMessage,
        }))
        throw error
      }
    },
    [getBooks, bookState.currentPage, bookState.pageSize],
  )

  /**
   * Update book
   */
  const updateBook = useCallback(
    async (id: string, bookData: UpdateBookData) => {
      setSingleBookState((prev) => ({ ...prev, isSaving: true, error: null }))

      try {
        const updatedBook = await BookService.updateBook(id, bookData)

        setSingleBookState((prev) => ({
          ...prev,
          book: updatedBook,
          isSaving: false,
        }))

        // Refresh the books list
        await getBooks({
          page: bookState.currentPage,
          pageSize: bookState.pageSize,
        })

        return updatedBook
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao atualizar livro'
        setSingleBookState((prev) => ({
          ...prev,
          isSaving: false,
          error: errorMessage,
        }))
        throw error
      }
    },
    [getBooks, bookState.currentPage, bookState.pageSize],
  )

  /**
   * Delete book
   */
  const deleteBook = useCallback(
    async (id: string) => {
      setBookState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        await BookService.deleteBook(id)

        // Refresh the books list
        await getBooks({
          page: bookState.currentPage,
          pageSize: bookState.pageSize,
        })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao excluir livro'
        setBookState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))
        throw error
      }
    },
    [getBooks, bookState.currentPage, bookState.pageSize],
  )

  /**
   * Update book stock
   */
  const updateBookStock = useCallback(
    async (id: string, stock: number) => {
      setSingleBookState((prev) => ({ ...prev, isSaving: true, error: null }))

      try {
        const updatedBook = await BookService.updateBookStock(id, stock)

        setSingleBookState((prev) => ({
          ...prev,
          book: updatedBook,
          isSaving: false,
        }))

        // Refresh the books list
        await getBooks({
          page: bookState.currentPage,
          pageSize: bookState.pageSize,
        })

        return updatedBook
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao atualizar estoque'
        setSingleBookState((prev) => ({
          ...prev,
          isSaving: false,
          error: errorMessage,
        }))
        throw error
      }
    },
    [getBooks, bookState.currentPage, bookState.pageSize],
  )

  /**
   * Get book by ISBN
   */
  const getBookByISBN = useCallback(async (isbn: string) => {
    setSingleBookState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const book = await BookService.getBookByISBN(isbn)

      setSingleBookState((prev) => ({
        ...prev,
        book,
        isLoading: false,
      }))

      return book
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao buscar livro por ISBN'
      setSingleBookState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setBookState((prev) => ({ ...prev, error: null }))
    setSingleBookState((prev) => ({ ...prev, error: null }))
  }, [])

  /**
   * Clear single book state
   */
  const clearBook = useCallback(() => {
    setSingleBookState({
      book: null,
      isLoading: false,
      isSaving: false,
      error: null,
    })
  }, [])

  return {
    // State
    books: bookState.books,
    totalCount: bookState.totalCount,
    currentPage: bookState.currentPage,
    pageSize: bookState.pageSize,
    isLoading: bookState.isLoading,
    error: bookState.error,

    // Single book state
    book: singleBookState.book,
    isSingleBookLoading: singleBookState.isLoading,
    isSaving: singleBookState.isSaving,
    singleBookError: singleBookState.error,

    // Actions
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    updateBookStock,
    getBookByISBN,
    clearError,
    clearBook,
  }
}
