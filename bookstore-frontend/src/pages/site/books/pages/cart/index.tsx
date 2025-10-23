import { useEffect, useState } from 'react'

import type { UserDTO } from '@/dtos/user'
import { useUser } from '@/hooks'
import { useAuth, useToast } from '@/providers'
import { useCart } from '@/providers'

import {
  AddressSelectionModal,
  CartItem,
  CartSummary,
  EmptyCart,
} from './components'
import * as S from './styles'

export const Cart = () => {
  const { items, summary, updateQuantity, removeItem, checkout } = useCart()
  const { showSuccess, showError } = useToast()
  const { isAuthenticated } = useAuth()
  const { getCurrentUser } = useUser()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [currentUserWithAddresses, setCurrentUserWithAddresses] =
    useState<UserDTO | null>(null)

  // Load current user with addresses
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (isAuthenticated && !currentUserWithAddresses) {
        try {
          const result = await getCurrentUser()
          if (result.success && result.data) {
            setCurrentUserWithAddresses(result.data)
          }
        } catch {
          // Silent error handling for user experience
        }
      }
    }

    loadCurrentUser()
  }, [isAuthenticated, currentUserWithAddresses, getCurrentUser])

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      showError('Você precisa estar logado para finalizar o pedido.')
      return
    }

    if (
      !currentUserWithAddresses?.addresses ||
      currentUserWithAddresses.addresses.length === 0
    ) {
      showError('Você precisa cadastrar um endereço de entrega.')
      return
    }

    setShowAddressModal(true)
  }

  const handleAddressSelected = async (deliveryAddressId: string) => {
    setShowAddressModal(false)
    setIsCheckingOut(true)

    try {
      const result = await checkout(deliveryAddressId)

      if (result.success) {
        showSuccess(
          `Pedido realizado com sucesso! Número do pedido: ${result.orderId}`,
        )
        // The cart will be automatically cleared by the checkout function
      } else {
        showError(result.error || 'Erro ao finalizar pedido. Tente novamente.')
      }
    } catch {
      showError('Erro inesperado ao finalizar pedido. Tente novamente.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
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
