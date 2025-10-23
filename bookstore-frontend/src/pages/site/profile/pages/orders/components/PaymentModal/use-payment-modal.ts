import { useEffect, useState } from 'react'

import type { CardDTO, OrderDTO, PaymentsDTO } from '@/dtos'
import { useCard } from '@/hooks'
import { useToast } from '@/providers'

interface SelectedCard extends CardDTO {
  amountInCents: number
}

interface UsePaymentModalProps {
  isOpen: boolean
  order: OrderDTO | null
  onPayment: (payments: PaymentsDTO) => Promise<void>
  onClose: () => void
}

export const usePaymentModal = ({
  isOpen,
  order,
  onPayment,
  onClose,
}: UsePaymentModalProps) => {
  const { cards, getCards } = useCard()
  const { showInfo } = useToast()
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])
  const [inputValues, setInputValues] = useState<Record<string, string>>({})

  // Load cards when modal opens
  useEffect(() => {
    if (isOpen) {
      getCards()
      setSelectedCards([])
      setInputValues({})
    }
  }, [isOpen, getCards])

  // Calculate total selected amount
  const totalSelectedAmount = selectedCards.reduce(
    (sum, card) => sum + card.amountInCents,
    0,
  )

  // Calculate remaining amount
  const remainingAmount = order
    ? order.totalPrice * 100 - totalSelectedAmount
    : 0

  // Check if payment is valid (amount matches order total and has at least one card)
  const isPaymentValid =
    selectedCards.length > 0 &&
    remainingAmount === 0 &&
    selectedCards.length <= 2 &&
    selectedCards.every((card) => card.amountInCents > 0)

  const handleCardSelection = (card: CardDTO) => {
    setSelectedCards((prev) => {
      const isSelected = prev.some((selected) => selected.id === card.id)

      if (isSelected) {
        // Remove card if already selected and clear its input value
        setInputValues((prevInputs) => {
          const newInputs = { ...prevInputs }
          delete newInputs[card.id]
          return newInputs
        })
        return prev.filter((selected) => selected.id !== card.id)
      } else {
        // Add card if not selected and less than 2 cards
        if (prev.length < 2) {
          const defaultAmount =
            prev.length === 0 ? (order?.totalPrice || 0) * 100 : remainingAmount

          // Set initial formatted value in input
          const formattedValue = (defaultAmount / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          setInputValues((prevInputs) => ({
            ...prevInputs,
            [card.id]: formattedValue,
          }))

          return [...prev, { ...card, amountInCents: defaultAmount }]
        }
        return prev
      }
    })
  }

  const handleAmountChange = (cardId: string, value: string) => {
    // Store the raw input value for display
    setInputValues((prev) => ({ ...prev, [cardId]: value }))

    // Parse and store the actual amount for calculations
    const cleanValue = value.replace(/\./g, '').replace(',', '.')
    const amountInCents = Math.round(parseFloat(cleanValue || '0') * 100)

    setSelectedCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, amountInCents } : card,
      ),
    )
  }

  const getInputValue = (cardId: string) => {
    return inputValues[cardId] || ''
  }

  const handleInputBlur = (cardId: string) => {
    const selectedCard = selectedCards.find((card) => card.id === cardId)
    if (selectedCard) {
      const formattedValue = (selectedCard.amountInCents / 100).toLocaleString(
        'pt-BR',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )
      setInputValues((prev) => ({ ...prev, [cardId]: formattedValue }))
    }
  }

  const handleConfirmPayment = async () => {
    if (!isPaymentValid || !order) return

    try {
      const payments: PaymentsDTO = {
        payments: selectedCards.map((card) => ({
          cardId: card.id,
          amountInCents: card.amountInCents,
        })),
      }

      await onPayment(payments)
      onClose()
    } catch {
      // Error handling is done in the parent component
    } finally {
      // Reset state
      setSelectedCards([])
    }
  }

  const getFormattedCardDisplay = (card: CardDTO) => {
    return `**** **** **** ${card.last4}`
  }

  const handleAddNewCard = () => {
    showInfo('Funcionalidade de adicionar cartão em desenvolvimento')
    // TODO: Implement add new card functionality
  }

  return {
    // Data
    cards,
    selectedCards,
    totalSelectedAmount,
    remainingAmount,
    isPaymentValid,

    // Actions
    handleCardSelection,
    handleAmountChange,
    handleConfirmPayment,
    handleAddNewCard,
    handleInputBlur,

    // Utilities
    getFormattedCardDisplay,
    getInputValue,
  }
}
