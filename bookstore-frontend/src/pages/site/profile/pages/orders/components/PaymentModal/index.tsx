import { CreditCard, Plus } from 'phosphor-react'

import { Button, Input, Modal } from '@/components'
import type { OrderDTO, PaymentsDTO } from '@/dtos'
import { formatCurrency } from '@/utils'

import * as S from './styles'
import { usePaymentModal } from './use-payment-modal'

interface PaymentModalProps {
  isOpen: boolean
  order: OrderDTO | null
  onClose: () => void
  onPayment: (payments: PaymentsDTO) => Promise<void>
  isLoading: boolean
}

export const PaymentModal = ({
  isOpen,
  order,
  onClose,
  onPayment,
  isLoading,
}: PaymentModalProps) => {
  const {
    cards,
    selectedCards,
    totalSelectedAmount,
    remainingAmount,
    isPaymentValid,
    handleCardSelection,
    handleAmountChange,
    handleConfirmPayment,
    handleAddNewCard,
    handleInputBlur,
    getFormattedCardDisplay,
    getInputValue,
  } = usePaymentModal({
    isOpen,
    order,
    onPayment,
    onClose,
  })

  if (!order) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <S.ModalContent>
        <S.Header>
          <S.Title>Pagamento do Pedido</S.Title>
          <S.OrderInfo>
            <S.OrderDetails>
              <S.OrderId>Pedido #{order.id.slice(-8)}</S.OrderId>
              <S.OrderTotal>{formatCurrency(order.totalPrice)}</S.OrderTotal>
            </S.OrderDetails>
          </S.OrderInfo>
        </S.Header>

        <S.CardsSection>
          <S.SectionTitle>
            Selecione o(s) cartão(ões) de pagamento
          </S.SectionTitle>

          {cards.length === 0 ? (
            <S.EmptyState>
              <S.EmptyIcon>
                <CreditCard size={32} />
              </S.EmptyIcon>
              <S.EmptyTitle>Nenhum cartão cadastrado</S.EmptyTitle>
              <S.EmptyDescription>
                Você precisa ter pelo menos um cartão cadastrado para fazer o
                pagamento.
              </S.EmptyDescription>
              <Button variant="primary" onClick={handleAddNewCard}>
                <Plus size={16} />
                Adicionar Cartão
              </Button>
            </S.EmptyState>
          ) : (
            <S.CardsContainer>
              {cards.map((card) => {
                const isSelected = selectedCards.some(
                  (selected) => selected.id === card.id,
                )

                return (
                  <S.CardOption
                    key={card.id}
                    isSelected={isSelected}
                    onClick={() => handleCardSelection(card)}
                    data-testid="payment-card-option"
                  >
                    <S.CardInfo>
                      <S.CardIcon>
                        <CreditCard size={24} />
                      </S.CardIcon>
                      <S.CardDetails>
                        <S.CardNumber>
                          {getFormattedCardDisplay(card)}
                        </S.CardNumber>
                        <S.CardBrand>
                          {card.brand}
                          {' • '}
                          {card.type === 'credit' ? 'Crédito' : 'Débito'}
                        </S.CardBrand>
                      </S.CardDetails>
                    </S.CardInfo>

                    {isSelected && (
                      <S.CardInputs>
                        <S.AmountLabel>Valor (R$)</S.AmountLabel>
                        <Input
                          type="text"
                          customSize="sm"
                          value={getInputValue(card.id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleAmountChange(card.id, e.target.value)
                          }
                          onBlur={() => handleInputBlur(card.id)}
                          placeholder="0,00"
                        />
                      </S.CardInputs>
                    )}
                  </S.CardOption>
                )
              })}
            </S.CardsContainer>
          )}
        </S.CardsSection>

        {selectedCards.length > 0 && (
          <S.TotalSection>
            <S.TotalRow>
              <S.TotalLabel>Total do pedido:</S.TotalLabel>
              <S.TotalValue>{formatCurrency(order.totalPrice)}</S.TotalValue>
            </S.TotalRow>
            <S.TotalRow>
              <S.TotalLabel>Total selecionado:</S.TotalLabel>
              <S.TotalValue
                variant={remainingAmount === 0 ? 'primary' : 'error'}
              >
                {formatCurrency(totalSelectedAmount / 100)}
              </S.TotalValue>
            </S.TotalRow>
            <S.TotalRow>
              <S.TotalLabel>Restante:</S.TotalLabel>
              <S.TotalValue
                variant={remainingAmount === 0 ? 'primary' : 'error'}
              >
                {formatCurrency(Math.abs(remainingAmount) / 100)}
              </S.TotalValue>
            </S.TotalRow>
          </S.TotalSection>
        )}

        {remainingAmount !== 0 && selectedCards.length > 0 && (
          <S.ValidationMessage type="error">
            {remainingAmount > 0
              ? 'O valor total dos cartões deve ser igual ao valor do pedido'
              : 'O valor total dos cartões não pode exceder o valor do pedido'}
          </S.ValidationMessage>
        )}

        <S.Footer>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-testid="payment-cancel-button">
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmPayment}
            disabled={!isPaymentValid || isLoading}
            data-testid="payment-confirm-button"
          >
            {isLoading ? 'Processando...' : 'Confirmar Pagamento'}
          </Button>
        </S.Footer>
      </S.ModalContent>
    </Modal>
  )
}
