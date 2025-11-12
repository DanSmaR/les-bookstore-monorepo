import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import type { CardDTO, CreateCardDTO, OrderDTO, PaymentsDTO } from '@/dtos'
import { useCard } from '@/hooks'
import { useToast } from '@/providers'
import { type CardFormData, cardFormSchema } from '@/schemas'
import {
  formatCardCVV,
  formatCardExpiry,
  formatCreditCard,
  removeMask,
} from '@/utils/input-masks'

interface SelectedCard extends CardDTO {
  amount: number
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
  const { cards, getCards, createCard, isSaving } = useCard()
  const { showInfo, showSuccess, showError } = useToast()
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [showAddCardForm, setShowAddCardForm] = useState(false)

  const cardForm = useForm<CardFormData>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      number: '',
      holderName: '',
      expiryDate: '',
      cvv: '',
      type: 'credit',
    },
  })

  const { handleSubmit, reset, setValue } = cardForm

  // Load cards when modal opens
  useEffect(() => {
    if (isOpen) {
      getCards()
      setSelectedCards([])
      setInputValues({})
      setShowAddCardForm(false)
      reset()
    }
  }, [isOpen, getCards, reset])

  // Calculate total selected amount
  const totalSelectedAmount = selectedCards.reduce(
    (sum, card) => sum + card.amount,
    0,
  )

  // Calculate remaining amount
  const orderTotal = order ? (order.subtotal || 0) - (order.discount || 0) : 0
  const remainingAmount = order ? orderTotal - totalSelectedAmount : 0

  // Check if payment is valid
  // Case 1: Order fully covered by tickets (R$0.00) - no cards needed
  // Case 2: Traditional payment - cards must match order total
  const isPaymentValid =
    orderTotal === 0 ||
    (selectedCards.length > 0 &&
      remainingAmount === 0 &&
      selectedCards.length <= 2 &&
      selectedCards.every((card) => card.amount > 0))

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
          const defaultAmount = prev.length === 0 ? orderTotal : remainingAmount

          // Set initial formatted value in input
          const formattedValue = defaultAmount.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          setInputValues((prevInputs) => ({
            ...prevInputs,
            [card.id]: formattedValue,
          }))

          return [...prev, { ...card, amount: defaultAmount }]
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
    const amount = parseFloat(cleanValue || '0')

    setSelectedCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, amount } : card)),
    )
  }

  const getInputValue = (cardId: string) => {
    return inputValues[cardId] || ''
  }

  const handleInputBlur = (cardId: string) => {
    const selectedCard = selectedCards.find((card) => card.id === cardId)
    if (selectedCard) {
      const formattedValue = selectedCard.amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      setInputValues((prev) => ({ ...prev, [cardId]: formattedValue }))
    }
  }

  const handleConfirmPayment = async () => {
    if (!isPaymentValid || !order) return

    try {
      // If order is fully covered by tickets (R$0.00), send empty payments array
      const payments: PaymentsDTO = {
        payments:
          orderTotal === 0
            ? []
            : selectedCards.map((card) => ({
                cardId: card.id,
                amount: card.amount,
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

  const handleAddNewCard = async (data: CardFormData) => {
    try {
      // Create new card
      const [month, year] = data.expiryDate.split('/')
      const expirationDate = new Date(
        2000 + parseInt(year),
        parseInt(month) - 1,
      )

      const cardData: CreateCardDTO = {
        number: removeMask(data.number),
        holderName: data.holderName,
        expirationDate,
        type: data.type,
        cvv: data.cvv,
      }

      await createCard(cardData)
      showSuccess('Cartão adicionado com sucesso!')
      setShowAddCardForm(false)
      reset()
      // Cards list will be automatically updated by the useCard hook
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : 'Erro ao adicionar cartão. Tente novamente.',
      )
    }
  }

  const handleOpenAddCardForm = () => {
    setShowAddCardForm(true)
    reset()
  }

  const handleCloseAddCardForm = () => {
    setShowAddCardForm(false)
    reset()
  }

  return {
    // Data
    cards,
    selectedCards,
    totalSelectedAmount,
    remainingAmount,
    isPaymentValid,
    showAddCardForm,
    isSavingCard: isSaving,

    // Form
    cardForm,
    handleCardFormSubmit: handleSubmit(handleAddNewCard),

    // Actions
    handleCardSelection,
    handleAmountChange,
    handleConfirmPayment,
    handleOpenAddCardForm,
    handleCloseAddCardForm,
    handleInputBlur,

    // Utilities
    getFormattedCardDisplay,
    getInputValue,
  }
}
