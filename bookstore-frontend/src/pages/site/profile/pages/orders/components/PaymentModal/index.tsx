import { CreditCard, Plus, Ticket } from 'phosphor-react'

import { Badge, Button, Input, Modal } from '@/components'
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

  const hasTickets = order.tickets && order.tickets.length > 0

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <S.ModalContent>
        <S.Header>
          <S.Title>Pagamento do Pedido</S.Title>
          <S.OrderInfo>
            <S.OrderDetails>
              <S.OrderId>Pedido #{order.id.slice(-8)}</S.OrderId>
              <S.OrderTotal>
                {formatCurrency((order.subtotal || 0) - (order.discount || 0))}
              </S.OrderTotal>
            </S.OrderDetails>
          </S.OrderInfo>
        </S.Header>

        {hasTickets && (
          <S.TicketsSection>
            <S.SectionTitle>
              <Ticket size={20} />
              Cupons Aplicados
            </S.SectionTitle>
            <S.TicketsList>
              {order.tickets.map((ticket) => (
                <S.TicketItem key={ticket.id}>
                  <S.TicketInfo>
                    <S.TicketHeader>
                      <S.TicketCode>{ticket.code}</S.TicketCode>
                      <Badge
                        variant={
                          ticket.nature === 'promotional'
                            ? 'default'
                            : 'success'
                        }
                        size="sm"
                      >
                        {ticket.nature === 'promotional'
                          ? 'Promocional'
                          : 'Troca'}
                      </Badge>
                    </S.TicketHeader>
                    {ticket.description && (
                      <S.TicketDescription>
                        {ticket.description}
                      </S.TicketDescription>
                    )}
                  </S.TicketInfo>
                  <S.TicketValue>
                    {ticket.type === 'percentage'
                      ? `${ticket.value}%`
                      : formatCurrency(ticket.value)}
                  </S.TicketValue>
                </S.TicketItem>
              ))}
            </S.TicketsList>
          </S.TicketsSection>
        )}

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
            {order.discount > 0 && (
              <>
                <S.TotalRow>
                  <S.TotalLabel>Subtotal:</S.TotalLabel>
                  <S.TotalValue>{formatCurrency(order.subtotal)}</S.TotalValue>
                </S.TotalRow>
                <S.TotalRow>
                  <S.TotalLabel>Desconto:</S.TotalLabel>
                  <S.TotalValue variant="success">
                    -{formatCurrency(order.discount)}
                  </S.TotalValue>
                </S.TotalRow>
              </>
            )}
            <S.TotalRow>
              <S.TotalLabel>Total do pedido:</S.TotalLabel>
              <S.TotalValue>
                {formatCurrency((order.subtotal || 0) - (order.discount || 0))}
              </S.TotalValue>
            </S.TotalRow>
            <S.TotalRow>
              <S.TotalLabel>Total selecionado:</S.TotalLabel>
              <S.TotalValue
                variant={remainingAmount === 0 ? 'primary' : 'error'}
              >
                {formatCurrency(totalSelectedAmount)}
              </S.TotalValue>
            </S.TotalRow>
            <S.TotalRow>
              <S.TotalLabel>Restante:</S.TotalLabel>
              <S.TotalValue
                variant={remainingAmount === 0 ? 'primary' : 'error'}
              >
                {formatCurrency(Math.abs(remainingAmount))}
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
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            data-testid="payment-cancel-button"
          >
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
