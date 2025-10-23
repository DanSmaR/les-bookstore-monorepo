import { useCallback, useEffect, useState } from 'react'

import type { MinBookDTO } from '@/dtos'
import { useBook } from '@/hooks'
import { useToast } from '@/providers'

type PriceRange = {
  min?: number
  max?: number
}

export const useCatalog = () => {
  const { getBooks, isLoading } = useBook()
  const { showError } = useToast()

  const [books, setBooks] = useState<MinBookDTO[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState<PriceRange>({})
  const [showOutOfStock, setShowOutOfStock] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const pageSize = 12

  const hasActiveFilters =
    searchTerm !== '' ||
    priceRange.min !== undefined ||
    priceRange.max !== undefined ||
    !showOutOfStock

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setPriceRange({})
    setShowOutOfStock(true)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks({
          page: currentPage - 1,
          pageSize,
        })

        if (response) {
          let filteredBooks = response.items || []

          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filteredBooks = filteredBooks.filter(
              (book: MinBookDTO) =>
                book.title.toLowerCase().includes(searchLower) ||
                book.author.toLowerCase().includes(searchLower) ||
                book.isbn.toLowerCase().includes(searchLower),
            )
          }

          if (priceRange.min !== undefined) {
            filteredBooks = filteredBooks.filter(
              (book: MinBookDTO) => book.price >= priceRange.min!,
            )
          }
          if (priceRange.max !== undefined) {
            filteredBooks = filteredBooks.filter(
              (book: MinBookDTO) => book.price <= priceRange.max!,
            )
          }

          if (!showOutOfStock) {
            filteredBooks = filteredBooks.filter(
              (book: MinBookDTO) => book.stock > 0,
            )
          }

          setBooks(filteredBooks)
          setTotalPages(
            response.totalCount > 0
              ? Math.ceil(response.totalCount / pageSize)
              : 1,
          )
        }
      } catch {
        showError(
          'Não foi possível carregar os livros. Verifique sua conexão e tente novamente.',
        )
        setBooks([])
      }
    }

    fetchBooks()
  }, [currentPage, searchTerm, priceRange, showOutOfStock, getBooks, showError])

  return {
    books,
    isLoading,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    showOutOfStock,
    setShowOutOfStock,
    currentPage,
    totalPages,
    handlePageChange,
    clearFilters,
    hasActiveFilters,
  }
}
