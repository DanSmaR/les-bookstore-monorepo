import { BookOpen, Trash } from 'phosphor-react'

import type { CartItemDTO } from '@/dtos'
import { formatPrice } from '@/utils'

import { QuantitySelector } from '../QuantitySelector'
import * as S from './styles'

interface CartItemProps {
  item: CartItemDTO
  onUpdateQuantity: (bookId: string, quantity: number) => void
  onRemove: (bookId: string) => void
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const { book, quantity, bookId } = item

  const handleIncrease = () => {
    onUpdateQuantity(bookId, quantity + 1)
  }

  const handleDecrease = () => {
    onUpdateQuantity(bookId, quantity - 1)
  }

  const handleQuantityChange = (newQuantity: number) => {
    onUpdateQuantity(bookId, newQuantity)
  }

  const handleRemove = () => {
    onRemove(bookId)
  }

  // Ensure price is a number
  const price =
    typeof book.price === 'string' ? parseFloat(book.price) : book.price
  const totalPrice = price * quantity

  return (
    <S.CartItemContainer data-testid="cart-item">
      {book.imageUrl ? (
        <S.BookImage
          style={{ backgroundImage: `url(${book.imageUrl})` }}
          role="img"
          aria-label={`Capa do livro ${book.title}`}
        />
      ) : (
        <S.BookImagePlaceholder>
          <BookOpen size={32} />
        </S.BookImagePlaceholder>
      )}

      <S.BookDetails>
        <S.BookTitle>{book.title}</S.BookTitle>
        <S.BookAuthor>por {book.author}</S.BookAuthor>
        <S.BookPrice>{formatPrice(book.price)}</S.BookPrice>
        <S.BookMeta>
          <S.BookISBN>{book.isbn}</S.BookISBN>
          {book.stock && (
            <span>
              {book.stock > 10
                ? 'Em estoque'
                : `${book.stock} unidade${book.stock > 1 ? 's' : ''} em estoque`}
            </span>
          )}
        </S.BookMeta>
      </S.BookDetails>

      <S.Actions>
        <S.RemoveButton
          onClick={handleRemove}
          aria-label={`Remover ${book.title}`}
          data-testid="cart-item-remove-button"
        >
          <Trash size={16} />
          Remover
        </S.RemoveButton>

        <QuantitySelector
          quantity={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onQuantityChange={handleQuantityChange}
          min={1}
          max={Math.min(book.stock || 99, 99)}
        />

        <S.TotalPrice>{formatPrice(totalPrice)}</S.TotalPrice>
      </S.Actions>
    </S.CartItemContainer>
  )
}
