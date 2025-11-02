import { MagnifyingGlass, X } from 'phosphor-react'

import { Button, Input, Select } from '@/components'

import * as S from './styles'

interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onClearFilters: () => void
  resultsCount: number
  totalCount: number
}

export const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
  resultsCount,
  totalCount,
}: SearchAndFiltersProps) => {
  const hasActiveFilters = searchTerm || statusFilter || startDate || endDate

  return (
    <S.SearchAndFiltersContainer>
      <S.SearchRow>
        <S.SearchInputWrapper>
          <S.SearchIcon>
            <MagnifyingGlass size={16} />
          </S.SearchIcon>
          <S.SearchInputWithIcon>
            <Input
              placeholder="Pesquisar por ID do pedido, produto, valor..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              fullWidth
            />
          </S.SearchInputWithIcon>
        </S.SearchInputWrapper>
      </S.SearchRow>

      <S.FiltersContainer>
        <S.FiltersGrid>
          <S.FilterGroup>
            <S.FilterLabel>Status do Pedido</S.FilterLabel>
            <Select
              value={statusFilter}
              onChange={onStatusChange}
              placeholder="Todos os status"
              options={[
                { value: 'pending', label: 'Pendente' },
                { value: 'processing', label: 'Processando' },
                { value: 'shipped', label: 'Enviado' },
                { value: 'delivered', label: 'Entregue' },
                { value: 'cancelled', label: 'Cancelado' },
              ]}
              fullWidth
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterLabel>Data de Início</S.FilterLabel>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              fullWidth
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterLabel>Data de Fim</S.FilterLabel>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              fullWidth
            />
          </S.FilterGroup>
        </S.FiltersGrid>

        <S.FilterActions>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              startIcon={<X size={16} />}
            >
              Limpar Filtros
            </Button>
          )}
        </S.FilterActions>
      </S.FiltersContainer>

      <S.ResultsInfo>
        <span>
          Mostrando {resultsCount} de {totalCount} pedidos
        </span>
      </S.ResultsInfo>
    </S.SearchAndFiltersContainer>
  )
}
