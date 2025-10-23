import { BookCard } from './components'
import * as S from './styles'
import type { Book } from './types'

interface BooksListSectionProps {
  books: Book[]
  onDeleteBook?: (bookId: string) => Promise<void>
}

export const BooksListSection = ({
  books,
  onDeleteBook,
}: BooksListSectionProps) => {
  return (
    <>
      {books.length > 0 ? (
        <S.BookGrid>
          {books.map((book) => (
            <BookCard key={book.id} book={book} onDeleteBook={onDeleteBook} />
          ))}
        </S.BookGrid>
      ) : (
        <S.EmptyState>
          <p>Nenhum livro encontrado com os filtros aplicados.</p>
        </S.EmptyState>
      )}
    </>
  )
}

// Export the Book type for use in parent components
export type { Book }
