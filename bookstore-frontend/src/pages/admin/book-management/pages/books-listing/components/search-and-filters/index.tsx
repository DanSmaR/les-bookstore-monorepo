import { Funnel, MagnifyingGlass } from 'phosphor-react'

import { Button, Input, Select } from '@/components'

import * as S from './styles'

interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  showFilters: boolean
  onToggleFilters: () => void
  authorFilter: string
  onAuthorChange: (value: string) => void
  publisherFilter: string
  onPublisherChange: (value: string) => void
  inStockFilter: string
  onInStockChange: (value: string) => void
  onClearFilters: () => void
  resultsCount: number
  totalCount: number
}

export const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  authorFilter,
  onAuthorChange,
  publisherFilter,
  onPublisherChange,
  inStockFilter,
  onInStockChange,
  onClearFilters,
  resultsCount,
  totalCount,
}: SearchAndFiltersProps) => {
  return (
    <S.SearchAndFiltersContainer>
      <S.SearchRow>
        <S.SearchInputWrapper>
          <S.SearchIcon>
            <MagnifyingGlass size={16} />
          </S.SearchIcon>
          <S.SearchInputWithIcon>
            <Input
              data-testid="book-search-input"
              placeholder="Pesquisar por título, autor, ISBN ou editora..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              fullWidth
            />
          </S.SearchInputWithIcon>
        </S.SearchInputWrapper>
        <Button
          data-testid="filters-toggle-button"
          variant="outline"
          onClick={onToggleFilters}
          startIcon={<Funnel size={16} />}
        >
          Filtros
        </Button>
      </S.SearchRow>

      <S.FiltersContainer show={showFilters}>
        <S.FiltersGrid>
          <S.FilterGroup>
            <S.FilterLabel>Autor</S.FilterLabel>
            <Input
              data-testid="author-filter-input"
              placeholder="Filtrar por autor"
              value={authorFilter}
              onChange={(e) => onAuthorChange(e.target.value)}
              fullWidth
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterLabel>Editora</S.FilterLabel>
            <Input
              data-testid="publisher-filter-input"
              placeholder="Filtrar por editora"
              value={publisherFilter}
              onChange={(e) => onPublisherChange(e.target.value)}
              fullWidth
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterLabel>Estoque</S.FilterLabel>
            <Select
              data-testid="stock-filter-select"
              value={inStockFilter}
              onChange={onInStockChange}
              placeholder="Todos"
              options={[
                { value: 'true', label: 'Em estoque' },
                { value: 'false', label: 'Fora de estoque' },
              ]}
              fullWidth
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.ClearFiltersButtonWrapper>
              <Button
                data-testid="clear-filters-button"
                variant="outline"
                onClick={onClearFilters}
                fullWidth
              >
                Limpar Filtros
              </Button>
            </S.ClearFiltersButtonWrapper>
          </S.FilterGroup>
        </S.FiltersGrid>
      </S.FiltersContainer>

      <S.ResultsInfo data-testid="results-count">
        Mostrando {resultsCount} de {totalCount} livros
      </S.ResultsInfo>
    </S.SearchAndFiltersContainer>
  )
}
