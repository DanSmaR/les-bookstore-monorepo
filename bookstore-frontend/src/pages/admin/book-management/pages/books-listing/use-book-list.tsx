import { useEffect, useState } from 'react'

import type { MinBookDTO } from '@/dtos/book'
import { useBook } from '@/hooks'
import { useToast } from '@/providers/toast/use-toast'

import type { Book } from './components/books-list-section/types'

interface BookListState {
  searchTerm: string
  showFilters: boolean
  authorFilter: string
  publisherFilter: string
  inStockFilter: string
  currentPage: number
  pageSize: number
}

/**
 * Convert MinBookDTO to Book format for the UI
 */
const mapBookToUI = (book: MinBookDTO): Book => {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    price: book.price,
    stock: book.stock,
    publisher: book.publisher || 'Não informado',
    status: book.stock > 0 ? 'Em estoque' : 'Fora de estoque',
  }
}

/**
 * Book List Hook
 * Manages book list page state and logic with pagination
 */
export const useBookList = () => {
  const {
    books,
    totalCount,
    isLoading,
    error,
    getBooks,
    deleteBook,
    clearError,
  } = useBook()

  const { showError, showSuccess } = useToast()

  const [state, setState] = useState<BookListState>({
    searchTerm: '',
    showFilters: false,
    authorFilter: '',
    publisherFilter: '',
    inStockFilter: '',
    currentPage: 1,
    pageSize: 10,
  })

  // Calculate pagination values
  const totalPages = Math.ceil(totalCount / state.pageSize)
  const mappedBooks = books.map(mapBookToUI)

  /**
   * Load books with current filters and pagination
   */
  const loadBooks = async () => {
    try {
      const params = {
        page: state.currentPage,
        pageSize: state.pageSize,
        search: state.searchTerm || undefined,
        author: state.authorFilter || undefined,
        publisher: state.publisherFilter || undefined,
        inStock:
          state.inStockFilter === 'true'
            ? true
            : state.inStockFilter === 'false'
              ? false
              : undefined,
      }

      await getBooks(params)
    } catch {
      showError('Não foi possível carregar a lista de livros. Tente novamente.')
    }
  }

  /**
   * Handle book deletion
   */
  const handleDeleteBook = async (bookId: string) => {
    try {
      await deleteBook(bookId)

      showSuccess('O livro foi excluído com sucesso.')

      // If we're on a page that becomes empty, go to previous page
      if (mappedBooks.length === 1 && state.currentPage > 1) {
        setState((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))
      } else {
        await loadBooks()
      }
    } catch {
      showError('Não foi possível excluir o livro. Tente novamente.')
    }
  }

  /**
   * Set search term
   */
  const setSearchTerm = (term: string) => {
    setState((prev) => ({ ...prev, searchTerm: term, currentPage: 1 }))
  }

  /**
   * Set author filter
   */
  const setAuthorFilter = (author: string) => {
    setState((prev) => ({ ...prev, authorFilter: author, currentPage: 1 }))
  }

  /**
   * Set publisher filter
   */
  const setPublisherFilter = (publisher: string) => {
    setState((prev) => ({
      ...prev,
      publisherFilter: publisher,
      currentPage: 1,
    }))
  }

  /**
   * Set stock filter
   */
  const setInStockFilter = (inStock: string) => {
    setState((prev) => ({ ...prev, inStockFilter: inStock, currentPage: 1 }))
  }

  /**
   * Set current page
   */
  const setCurrentPage = (page: number) => {
    setState((prev) => ({ ...prev, currentPage: page }))
  }

  /**
   * Set page size
   */
  const setPageSize = (size: number) => {
    setState((prev) => ({ ...prev, pageSize: size, currentPage: 1 }))
  }

  /**
   * Toggle filters visibility
   */
  const toggleFilters = () => {
    setState((prev) => ({ ...prev, showFilters: !prev.showFilters }))
  }

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setState((prev) => ({
      ...prev,
      searchTerm: '',
      authorFilter: '',
      publisherFilter: '',
      inStockFilter: '',
      currentPage: 1,
    }))
  }

  // Load books when state changes
  useEffect(() => {
    loadBooks()
  }, [
    state.currentPage,
    state.pageSize,
    state.searchTerm,
    state.authorFilter,
    state.publisherFilter,
    state.inStockFilter,
  ])

  // Clear errors when component unmounts or when needed
  useEffect(() => {
    if (error) {
      const timer = window.setTimeout(() => {
        clearError()
      }, 5000)

      return () => window.clearTimeout(timer)
    }
  }, [error, clearError])

  return {
    // Data
    books: mappedBooks,
    totalBooks: totalCount,
    isLoading,
    error,

    // Pagination
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    totalPages,

    // Filters
    searchTerm: state.searchTerm,
    showFilters: state.showFilters,
    authorFilter: state.authorFilter,
    publisherFilter: state.publisherFilter,
    inStockFilter: state.inStockFilter,

    // Actions
    setSearchTerm,
    setAuthorFilter,
    setPublisherFilter,
    setInStockFilter,
    setCurrentPage,
    setPageSize,
    clearFilters,
    toggleFilters,
    handleDeleteBook,
    loadBooks,
  }
}
