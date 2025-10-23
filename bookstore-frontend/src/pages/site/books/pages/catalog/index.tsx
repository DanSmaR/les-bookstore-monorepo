import { Funnel, MagnifyingGlass, X } from 'phosphor-react'
import { useState } from 'react'

import { Input } from '@/components'
import type { BookDTO, MinBookDTO } from '@/dtos'
import { useCart } from '@/providers'

import { BookCard } from './components/book-card'
import { BookDetailsModal } from './components/book-details-modal'
import * as S from './styles'
import { useCatalog } from './use-catalog'

export const Catalog = () => {
  const { addItem } = useCart()
  const [selectedBook, setSelectedBook] = useState<BookDTO | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
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
  } = useCatalog()

  const handleAddToCart = (book: MinBookDTO) => {
    // Convert MinBookDTO to BookDTO for cart
    const bookForCart: BookDTO = {
      ...book,
      description: undefined,
      publishedDate: undefined,
    }
    addItem(bookForCart, 1)
  }

  const handleBookClick = (book: MinBookDTO) => {
    // Convert MinBookDTO to BookDTO for modal
    // In a real app, you might fetch full details here
    const fullBook: BookDTO = {
      ...book,
      description: undefined,
      publishedDate: undefined,
    }
    setSelectedBook(fullBook)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBook(null)
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>Catálogo de Livros</S.Title>
        <S.Subtitle>Explore nossa coleção completa</S.Subtitle>
      </S.Header>

      <S.FiltersSection>
        <S.SearchBar>
          <MagnifyingGlass size={20} weight="bold" />
          <S.SearchInput
            type="text"
            placeholder="Buscar por título, autor ou ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <S.ClearSearchButton onClick={() => setSearchTerm('')}>
              <X size={20} />
            </S.ClearSearchButton>
          )}
        </S.SearchBar>

        <S.FiltersRow>
          <S.FilterGroup>
            <S.FilterLabel>
              <Funnel size={16} weight="bold" />
              Filtros
            </S.FilterLabel>

            <S.PriceFilter>
              <S.PriceLabel>Faixa de Preço</S.PriceLabel>
              <S.PriceInputs>
                <Input
                  type="number"
                  placeholder="Min"
                  customSize="sm"
                  value={priceRange.min || ''}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      min: Number(e.target.value) || undefined,
                    })
                  }
                  startIcon={<span>R$</span>}
                />
                <span>até</span>
                <Input
                  type="number"
                  placeholder="Max"
                  customSize="sm"
                  value={priceRange.max || ''}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: Number(e.target.value) || undefined,
                    })
                  }
                  startIcon={<span>R$</span>}
                />
              </S.PriceInputs>
            </S.PriceFilter>

            <S.CheckboxFilter>
              <input
                type="checkbox"
                id="show-out-of-stock"
                checked={showOutOfStock}
                onChange={(e) => setShowOutOfStock(e.target.checked)}
              />
              <label htmlFor="show-out-of-stock">Mostrar itens esgotados</label>
            </S.CheckboxFilter>
          </S.FilterGroup>

          {hasActiveFilters && (
            <S.ClearFiltersButton onClick={clearFilters}>
              <X size={16} />
              Limpar Filtros
            </S.ClearFiltersButton>
          )}
        </S.FiltersRow>
      </S.FiltersSection>

      {isLoading ? (
        <S.LoadingContainer>
          <S.LoadingSpinner />
          <S.LoadingText>Carregando livros...</S.LoadingText>
        </S.LoadingContainer>
      ) : books.length === 0 ? (
        <S.EmptyState>
          <S.EmptyStateText>
            Nenhum livro encontrado com os filtros aplicados.
          </S.EmptyStateText>
          {hasActiveFilters && (
            <S.ClearFiltersButton onClick={clearFilters}>
              Limpar Filtros
            </S.ClearFiltersButton>
          )}
        </S.EmptyState>
      ) : (
        <>
          <S.BooksGrid>
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={handleAddToCart}
                onClick={handleBookClick}
              />
            ))}
          </S.BooksGrid>

          {totalPages > 1 && (
            <S.Pagination>
              <S.PaginationButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </S.PaginationButton>

              <S.PaginationInfo>
                Página {currentPage} de {totalPages}
              </S.PaginationInfo>

              <S.PaginationButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </S.PaginationButton>
            </S.Pagination>
          )}
        </>
      )}

      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </S.Container>
  )
}
