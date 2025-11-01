import { Info, Ticket } from 'phosphor-react'
import { useEffect, useMemo } from 'react'

import type { TicketDTO } from '@/dtos'
import { useUserTickets } from '@/hooks'

import * as S from './styles'

interface TicketSelectorProps {
  selectedTickets: TicketDTO[]
  onToggleTicket: (ticket: TicketDTO) => void
  onClearSelection: () => void
  cartSubtotal: number
}

export const TicketSelector = ({
  selectedTickets,
  onToggleTicket,
  onClearSelection,
  cartSubtotal,
}: TicketSelectorProps) => {
  const { tickets, isLoading, loadUserTickets } = useUserTickets()

  // Load tickets on mount
  useEffect(() => {
    loadUserTickets()
  }, [loadUserTickets])

  // Calculate estimated discount preview
  const estimatedDiscount = useMemo(() => {
    if (selectedTickets.length === 0 || cartSubtotal === 0) return 0

    let discount = 0
    let remainingAmount = cartSubtotal

    // Apply promotional tickets first
    const promotional = selectedTickets.filter(
      (t) => t.nature === 'promotional',
    )
    const exchange = selectedTickets.filter((t) => t.nature === 'exchange')

    // Apply first promotional ticket
    if (promotional.length > 0) {
      const ticket = promotional[0]
      let ticketDiscount = 0

      if (ticket.type === 'percentage') {
        ticketDiscount = (remainingAmount * ticket.value) / 100
      } else {
        ticketDiscount = ticket.value
      }

      // Apply max discount limit if exists
      if (ticket.maxDiscount && ticketDiscount > ticket.maxDiscount) {
        ticketDiscount = ticket.maxDiscount
      }

      discount += Math.min(ticketDiscount, remainingAmount)
      remainingAmount -= ticketDiscount
    }

    // Apply exchange tickets
    for (const ticket of exchange) {
      if (remainingAmount <= 0) break
      const ticketValue = Math.min(ticket.value, remainingAmount)
      discount += ticketValue
      remainingAmount -= ticketValue
    }

    return Math.min(discount, cartSubtotal)
  }, [selectedTickets, cartSubtotal])

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatTicketValue = (ticket: TicketDTO) => {
    if (ticket.type === 'percentage') {
      return `${ticket.value}% OFF`
    }
    return formatPrice(ticket.value)
  }

  const formatExpirationDate = (date?: string) => {
    if (!date) return null
    const expiration = new Date(date)
    return `Válido até ${expiration.toLocaleDateString('pt-BR')}`
  }

  const isTicketSelected = (ticket: TicketDTO) => {
    return selectedTickets.some((t) => t.id === ticket.id)
  }

  const hasMultiplePromotional = useMemo(() => {
    const promotionalCount = selectedTickets.filter(
      (t) => t.nature === 'promotional',
    ).length
    return promotionalCount > 1
  }, [selectedTickets])

  const hasPromotionalSelected = useMemo(() => {
    return selectedTickets.some((t) => t.nature === 'promotional')
  }, [selectedTickets])

  const isPromotionalDisabled = (ticket: TicketDTO) => {
    // Disable promotional tickets if another promotional ticket is already selected
    return (
      ticket.nature === 'promotional' &&
      hasPromotionalSelected &&
      !isTicketSelected(ticket)
    )
  }

  if (isLoading) {
    return (
      <S.TicketContainer>
        <S.TicketHeader>
          <S.TicketHeaderLeft>
            <S.TicketIcon>
              <Ticket size={20} />
            </S.TicketIcon>
            <S.TicketTitle>Cupons de Desconto</S.TicketTitle>
          </S.TicketHeaderLeft>
        </S.TicketHeader>
        <S.LoadingState>
          <p>Carregando cupons disponíveis...</p>
        </S.LoadingState>
      </S.TicketContainer>
    )
  }

  if (tickets.length === 0) {
    return (
      <S.TicketContainer>
        <S.TicketHeader>
          <S.TicketHeaderLeft>
            <S.TicketIcon>
              <Ticket size={20} />
            </S.TicketIcon>
            <S.TicketTitle>Cupons de Desconto</S.TicketTitle>
          </S.TicketHeaderLeft>
        </S.TicketHeader>
        <S.EmptyState>
          <S.EmptyStateIcon>🎟️</S.EmptyStateIcon>
          <S.EmptyStateText>
            Você não possui cupons disponíveis no momento.
          </S.EmptyStateText>
        </S.EmptyState>
      </S.TicketContainer>
    )
  }

  return (
    <S.TicketContainer>
      <S.TicketHeader>
        <S.TicketHeaderLeft>
          <S.TicketIcon>
            <Ticket size={20} />
          </S.TicketIcon>
          <S.TicketTitle>Cupons Disponíveis ({tickets.length})</S.TicketTitle>
        </S.TicketHeaderLeft>
        {selectedTickets.length > 0 && (
          <S.ClearButton onClick={onClearSelection}>
            Limpar seleção
          </S.ClearButton>
        )}
      </S.TicketHeader>

      <S.TicketList>
        {tickets.map((ticket) => (
          <S.TicketCard
            key={ticket.id}
            $isSelected={isTicketSelected(ticket)}
            data-testid="ticket-card"
          >
            <input
              type="checkbox"
              checked={isTicketSelected(ticket)}
              onChange={() => onToggleTicket(ticket)}
              disabled={isPromotionalDisabled(ticket)}
              data-testid="ticket-checkbox"
              aria-label={`Selecionar cupom ${ticket.code}`}
            />
            <S.TicketInfo>
              <S.TicketMainInfo>
                <S.TicketCode data-testid="ticket-code">
                  {ticket.code}
                </S.TicketCode>
                <S.TicketNatureBadge
                  $nature={ticket.nature}
                  data-testid="ticket-nature"
                >
                  {ticket.nature === 'promotional' ? 'Promocional' : 'Troca'}
                </S.TicketNatureBadge>
                <S.TicketValue data-testid="ticket-value">
                  {formatTicketValue(ticket)}
                </S.TicketValue>
              </S.TicketMainInfo>
              <S.TicketDetails>
                {ticket.description && (
                  <S.TicketDescription>
                    {ticket.description}
                  </S.TicketDescription>
                )}
                {ticket.validUntil && (
                  <S.TicketExpiration data-testid="ticket-expiration">
                    {formatExpirationDate(ticket.validUntil)}
                  </S.TicketExpiration>
                )}
              </S.TicketDetails>
            </S.TicketInfo>
          </S.TicketCard>
        ))}
      </S.TicketList>

      {selectedTickets.length > 0 && (
        <S.SummarySection>
          <S.SummaryRow>
            <S.SummaryLabel>
              {selectedTickets.length} cupom
              {selectedTickets.length > 1 ? 's' : ''} selecionado
              {selectedTickets.length > 1 ? 's' : ''}
            </S.SummaryLabel>
            <S.SummaryValue data-testid="estimated-discount">
              {formatPrice(estimatedDiscount)}
            </S.SummaryValue>
          </S.SummaryRow>

          {hasPromotionalSelected && (
            <S.OptimizationHint>
              <S.HintIcon>
                <Info size={16} weight="fill" />
              </S.HintIcon>
              <S.HintText>
                Apenas um cupom promocional pode ser usado por compra (RN0033).
              </S.HintText>
            </S.OptimizationHint>
          )}

          <S.OptimizationHint>
            <S.HintIcon>
              <Info size={16} weight="fill" />
            </S.HintIcon>
            <S.HintText>
              O sistema otimizará automaticamente a combinação de cupons para
              minimizar o troco e maximizar seu benefício.
            </S.HintText>
          </S.OptimizationHint>
        </S.SummarySection>
      )}
    </S.TicketContainer>
  )
}
