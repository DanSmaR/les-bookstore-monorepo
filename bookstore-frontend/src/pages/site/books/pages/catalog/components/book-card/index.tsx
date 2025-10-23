import { BookOpen, ShoppingCart } from 'phosphor-react'
import { useState } from 'react'

import { Badge, Button } from '@/components'
import type { MinBookDTO } from '@/dtos'

import * as S from './styles'

type BookCardProps = {
  book: MinBookDTO
  onAddToCart: (book: MinBookDTO) => void
  onClick?: (book: MinBookDTO) => void
  isAddingToCart?: boolean
}

export const BookCard = ({
  book,
  onAddToCart,
  onClick,
  isAddingToCart = false,
}: BookCardProps) => {
  const [imageError, setImageError] = useState(false)
  const isOutOfStock = book.stock <= 0
  const isLowStock = book.stock > 0 && book.stock <= 5

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      onAddToCart(book)
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(book)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Ensure price is a number
  const price =
    typeof book.price === 'string' ? parseFloat(book.price) : book.price

  const bookImageUrl = book.imageUrl
  const showPlaceholder = !bookImageUrl || imageError

  return (
    <S.Card onClick={handleCardClick} data-testid="book-card">
      <S.ImageContainer>
        {showPlaceholder ? (
          <S.PlaceholderContainer>
            <BookOpen size={64} weight="light" />
          </S.PlaceholderContainer>
        ) : (
          <S.BookImage
            src={bookImageUrl}
            alt={book.title}
            onError={handleImageError}
          />
        )}
        {isOutOfStock && (
          <S.StockBadgeContainer>
            <Badge variant="danger">Esgotado</Badge>
          </S.StockBadgeContainer>
        )}
        {isLowStock && (
          <S.StockBadgeContainer>
            <Badge variant="warning">Últimas unidades</Badge>
          </S.StockBadgeContainer>
        )}
      </S.ImageContainer>

      <S.Content>
        <S.Title data-testid="book-title">{book.title}</S.Title>
        <S.Author>{book.author}</S.Author>
        {book.publisher && <S.Publisher>{book.publisher}</S.Publisher>}

        <S.InfoRow>
          <S.ISBN>ISBN: {book.isbn}</S.ISBN>
          <S.Stock isLow={isLowStock} isOut={isOutOfStock}>
            {book.stock} em estoque
          </S.Stock>
        </S.InfoRow>

        <S.Footer>
          <S.Price>R$ {price.toFixed(2)}</S.Price>
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              variant={isOutOfStock ? 'outline' : 'primary'}
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              loading={isAddingToCart}
              startIcon={<ShoppingCart size={16} weight="bold" />}
              data-testid="book-add-to-cart-button"
            >
              {isOutOfStock ? 'Indisponível' : 'Adicionar'}
            </Button>
          </div>
        </S.Footer>
      </S.Content>
    </S.Card>
  )
}
