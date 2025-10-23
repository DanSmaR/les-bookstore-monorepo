import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  NavigationButton,
  Select,
} from '@/components'
import { PageHeader } from '@/pages/admin/layout/components'
import { ROUTES } from '@/routes'

import { BooksListSection, SearchAndFilters } from './components'
import * as S from './styles'
import { useBookList } from './use-book-list'

export const BooksListing = () => {
  const {
    books,
    totalBooks,
    isLoading,
    currentPage,
    pageSize,
    totalPages,
    searchTerm,
    showFilters,
    authorFilter,
    publisherFilter,
    inStockFilter,
    setSearchTerm,
    setAuthorFilter,
    setPublisherFilter,
    setInStockFilter,
    setCurrentPage,
    setPageSize,
    clearFilters,
    toggleFilters,
    handleDeleteBook,
  } = useBookList()

  return (
    <S.BooksContainer>
      <PageHeader
        title="Livros"
        subtitle="Gerencie o catálogo de livros da sua livraria"
        actionButton={
          <NavigationButton to={ROUTES.ADMIN_BOOKS_NEW}>
            Adicionar Livro
          </NavigationButton>
        }
      />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Busca e Filtros</CardTitle>
          <CardDescription>
            Use a busca e os filtros para encontrar livros específicos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showFilters={showFilters}
            onToggleFilters={toggleFilters}
            authorFilter={authorFilter}
            onAuthorChange={setAuthorFilter}
            publisherFilter={publisherFilter}
            onPublisherChange={setPublisherFilter}
            inStockFilter={inStockFilter}
            onInStockChange={setInStockFilter}
            onClearFilters={clearFilters}
            resultsCount={books.length}
            totalCount={totalBooks}
          />
        </CardContent>
      </Card>

      {/* Books List */}
      {isLoading ? (
        <Card>
          <CardContent>
            <p>Carregando livros...</p>
          </CardContent>
        </Card>
      ) : (
        <BooksListSection books={books} onDeleteBook={handleDeleteBook} />
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <Card>
          <CardContent>
            <S.PaginationContainer>
              <S.PaginationInfo>
                Mostrando {books.length} de {totalBooks} livros
              </S.PaginationInfo>
              <S.PaginationControls>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <S.PageInfo>
                  Página {currentPage} de {totalPages}
                </S.PageInfo>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
                <Select
                  value={pageSize.toString()}
                  onChange={(value) => setPageSize(Number(value))}
                  options={[
                    { value: '5', label: '5 por página' },
                    { value: '10', label: '10 por página' },
                    { value: '20', label: '20 por página' },
                    { value: '50', label: '50 por página' },
                  ]}
                  size="sm"
                />
              </S.PaginationControls>
            </S.PaginationContainer>
          </CardContent>
        </Card>
      )}
    </S.BooksContainer>
  )
}
