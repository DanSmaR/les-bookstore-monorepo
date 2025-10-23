import { ShoppingCart, X } from 'phosphor-react'
import { useState } from 'react'

import { Badge, Button } from '@/components'
import type { BookDTO } from '@/dtos'
import { formatPrice } from '@/utils'

import * as S from './styles'

type BookDetailsModalProps = {
  book: BookDTO
  isOpen: boolean
  onClose: () => void
  onAddToCart: (book: BookDTO) => void
  isAddingToCart?: boolean
}

export const BookDetailsModal = ({
  book,
  isOpen,
  onClose,
  onAddToCart,
  isAddingToCart = false,
}: BookDetailsModalProps) => {
  const [imageError, setImageError] = useState(false)

  const isOutOfStock = book.stock <= 0
  const isLowStock = book.stock > 0 && book.stock <= 5

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      onAddToCart(book)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const price =
    typeof book.price === 'string' ? parseFloat(book.price) : book.price
  const bookImageUrl = book.imageUrl
  const showPlaceholder = !bookImageUrl || imageError

  if (!isOpen) return null

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitle>Detalhes do Livro</S.ModalTitle>
          <S.CloseButton onClick={onClose}>
            <X size={20} />
          </S.CloseButton>
        </S.ModalHeader>

        <S.ModalBody>
          <S.BookDetailsContainer>
            <S.BookImageSection>
              {showPlaceholder ? (
                <S.ModalPlaceholder>
                  <S.PlaceholderIcon />
                </S.ModalPlaceholder>
              ) : (
                <S.ModalBookImage
                  src={bookImageUrl}
                  alt={book.title}
                  onError={handleImageError}
                />
              )}
              {isOutOfStock && (
                <S.ModalBadgeContainer>
                  <Badge variant="danger">Esgotado</Badge>
                </S.ModalBadgeContainer>
              )}
              {isLowStock && (
                <S.ModalBadgeContainer>
                  <Badge variant="warning">Últimas unidades</Badge>
                </S.ModalBadgeContainer>
              )}
            </S.BookImageSection>

            <S.BookInfoSection>
              <S.BookTitle>{book.title}</S.BookTitle>
              <S.BookAuthor>por {book.author}</S.BookAuthor>

              {book.publisher && (
                <S.BookPublisher>Editora: {book.publisher}</S.BookPublisher>
              )}

              {book.publishedDate && (
                <S.BookPublishedDate>
                  Publicado em: {new Date(book.publishedDate).getFullYear()}
                </S.BookPublishedDate>
              )}

              <S.BookISBN>ISBN: {book.isbn}</S.BookISBN>

              <S.StockInfo isLow={isLowStock} isOut={isOutOfStock}>
                {isOutOfStock
                  ? 'Produto esgotado'
                  : `${book.stock} unidade${book.stock > 1 ? 's' : ''} em estoque`}
              </S.StockInfo>

              {book.description && (
                <S.DescriptionSection>
                  <S.DescriptionTitle>Descrição</S.DescriptionTitle>
                  <S.BookDescription>{book.description}</S.BookDescription>
                </S.DescriptionSection>
              )}

              <S.PriceSection>
                <S.BookPrice>{formatPrice(price)}</S.BookPrice>
                <Button
                  variant={isOutOfStock ? 'outline' : 'primary'}
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  loading={isAddingToCart}
                  startIcon={<ShoppingCart size={20} weight="bold" />}
                  fullWidth
                >
                  {isOutOfStock ? 'Indisponível' : 'Adicionar ao Carrinho'}
                </Button>
              </S.PriceSection>
            </S.BookInfoSection>
          </S.BookDetailsContainer>
        </S.ModalBody>
      </S.ModalContent>
    </S.ModalOverlay>
  )
}
