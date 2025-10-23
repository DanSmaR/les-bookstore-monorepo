import { Lock, ShoppingCart } from 'phosphor-react'
import { useNavigate } from 'react-router'

import type { CartSummaryDTO } from '@/dtos'
import { ROUTES } from '@/routes/constants'

import * as S from './styles'

interface CartSummaryProps {
  summary: CartSummaryDTO
  onCheckout: () => void
  isCheckingOut?: boolean
}

export const CartSummary = ({
  summary,
  onCheckout,
  isCheckingOut = false,
}: CartSummaryProps) => {
  const navigate = useNavigate()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const handleContinueShopping = () => {
    navigate(ROUTES.CATALOG)
  }

  const shippingCost = 0 // For now, free shipping
  const finalTotal = summary.totalPrice + shippingCost

  return (
    <S.SummaryContainer>
      <S.SummaryTitle>Resumo do Pedido</S.SummaryTitle>

      <S.SummaryRow>
        <S.SummaryLabel>
          {summary.totalUniqueItems} produto
          {summary.totalUniqueItems > 1 ? 's' : ''}
        </S.SummaryLabel>
        <S.SummaryValue>{formatPrice(summary.totalPrice)}</S.SummaryValue>
      </S.SummaryRow>

      <S.SummaryRow>
        <S.SummaryLabel>
          {summary.totalItems} item{summary.totalItems > 1 ? 's' : ''}
        </S.SummaryLabel>
        <S.SummaryValue>
          {summary.totalItems} unidade{summary.totalItems > 1 ? 's' : ''}
        </S.SummaryValue>
      </S.SummaryRow>

      <S.SummaryRow>
        <S.SummaryLabel>Entrega</S.SummaryLabel>
        <S.SummaryValue>
          {shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}
        </S.SummaryValue>
      </S.SummaryRow>

      <S.TotalRow>
        <S.TotalLabel>Total</S.TotalLabel>
        <S.TotalValue data-testid="cart-total-price">{formatPrice(finalTotal)}</S.TotalValue>
      </S.TotalRow>

      <S.CheckoutButton
        onClick={onCheckout}
        disabled={isCheckingOut || summary.totalItems === 0}
        data-testid="cart-checkout-button"
      >
        {isCheckingOut ? 'Processando...' : 'Finalizar Compra'}
      </S.CheckoutButton>

      <S.ContinueShoppingButton onClick={handleContinueShopping} data-testid="cart-continue-shopping-button">
        <ShoppingCart size={16} />
        Continuar Comprando
      </S.ContinueShoppingButton>

      <S.SecureCheckoutInfo>
        <Lock size={14} />
        Compra 100% segura e protegida
      </S.SecureCheckoutInfo>
    </S.SummaryContainer>
  )
}
