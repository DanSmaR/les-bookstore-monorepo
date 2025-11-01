import {
  AddressSelectionModal,
  CartItem,
  CartSummary,
  EmptyCart,
  TicketSelector,
} from './components'
import * as S from './styles'
import { useCartPage } from './use-cart-page'

export const Cart = () => {
  const {
    items,
    summary,
    selectedTickets,
    isEmpty,
    currentUserWithAddresses,
    isCheckingOut,
    showAddressModal,
    updateQuantity,
    removeItem,
    onToggleTicket,
    onClearTickets,
    handleCheckout,
    handleAddressSelected,
    setShowAddressModal,
  } = useCartPage()

  if (isEmpty) {
    return <EmptyCart />
  }

  return (
    <S.CartContainer>
      <S.CartHeader>
        <S.CartTitle>Meu Carrinho</S.CartTitle>
        <S.CartItemCount>
          {summary.totalItems} item{summary.totalItems > 1 ? 's' : ''}
        </S.CartItemCount>
      </S.CartHeader>

      <S.CartContent>
        <S.CartItemsList>
          {items.map((item) => (
            <CartItem
              key={item.book.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </S.CartItemsList>

        <S.CartSidePanel>
          <TicketSelector
            selectedTickets={selectedTickets}
            onToggleTicket={onToggleTicket}
            onClearSelection={onClearTickets}
            cartSubtotal={summary.originalPrice || summary.totalPrice}
          />
          <CartSummary
            summary={summary}
            onCheckout={handleCheckout}
            isCheckingOut={isCheckingOut}
          />
        </S.CartSidePanel>
      </S.CartContent>

      {currentUserWithAddresses && (
        <AddressSelectionModal
          isOpen={showAddressModal}
          addresses={currentUserWithAddresses.addresses}
          onConfirm={handleAddressSelected}
          onClose={() => setShowAddressModal(false)}
        />
      )}
    </S.CartContainer>
  )
}
