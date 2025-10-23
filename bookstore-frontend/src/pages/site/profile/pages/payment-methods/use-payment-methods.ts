import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import type { CardDTO, CreateCardDTO } from '@/dtos'
import { useCard } from '@/hooks'
import { useToast } from '@/providers'
import { type CardFormData, cardFormSchema } from '@/schemas'
import {
  formatCardCVV,
  formatCardExpiry,
  formatCreditCard,
  removeMask,
} from '@/utils/input-masks'

/**
 * Payment Methods Page Hook
 * Manages the payment methods page state and form logic
 */
export const usePaymentMethods = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState<CardDTO | null>(null)

  const {
    cards,
    isLoading,
    isSaving,
    error,
    getCards,
    createCard,
    deleteCard,
    clearErrors,
  } = useCard()
  const toast = useToast()

  // Card form
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

  const { handleSubmit, reset, setValue, watch } = cardForm

  // Load cards on mount
  useEffect(() => {
    getCards()
  }, [getCards])

  // Show success/error messages
  useEffect(() => {
    if (error) {
      toast.showError(error)
      clearErrors()
    }
  }, [error, toast, clearErrors])

  /**
   * Handle opening the add card form
   */
  const handleAddCard = () => {
    reset()
    setIsFormOpen(true)
  }

  /**
   * Handle closing the form
   */
  const handleCloseForm = () => {
    setIsFormOpen(false)
    reset()
  }

  /**
   * Handle form submission
   */
  const handleFormSubmit = async (data: CardFormData) => {
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
      toast.showSuccess('Cartão adicionado com sucesso!')
      handleCloseForm()
    } catch {
      // Error is handled by the useEffect that watches for errors
    }
  }

  /**
   * Handle opening delete confirmation modal
   */
  const handleDeleteCard = (card: CardDTO) => {
    setCardToDelete(card)
  }

  /**
   * Handle closing delete confirmation modal
   */
  const handleCloseDeleteModal = () => {
    setCardToDelete(null)
  }

  /**
   * Handle confirming card deletion
   */
  const handleConfirmDeleteCard = async () => {
    if (!cardToDelete) return

    try {
      await deleteCard(cardToDelete.id)
      toast.showSuccess('Cartão removido com sucesso!')
      setCardToDelete(null)
    } catch {
      // Error is handled by the useEffect that watches for errors
    }
  }

  /**
   * Format card number input
   */
  const handleCardNumberChange = (value: string) => {
    const formatted = formatCreditCard(value)
    setValue('number', formatted)
  }

  /**
   * Format expiry date input
   */
  const handleExpiryDateChange = (value: string) => {
    const formatted = formatCardExpiry(value)
    setValue('expiryDate', formatted)
  }

  /**
   * Format CVV input
   */
  const handleCVVChange = (value: string) => {
    const formatted = formatCardCVV(value)
    setValue('cvv', formatted)
  }

  /**
   * Get card brand from number
   */
  const getCardBrand = (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s/g, '')

    if (cleanNumber.startsWith('4')) return 'Visa'
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2'))
      return 'Mastercard'
    if (cleanNumber.startsWith('3')) return 'American Express'
    if (cleanNumber.startsWith('6')) return 'Discover'

    return 'Cartão'
  }

  /**
   * Get formatted card display
   */
  const getFormattedCardDisplay = (card: CardDTO): string => {
    const brandMap: Record<string, string> = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      american_express: 'American Express',
      elo: 'Elo',
      hipercard: 'Hipercard',
      discover: 'Discover',
      jcb: 'JCB',
      diners_club: 'Diners Club',
    }

    const brand = brandMap[card.brand] || 'Cartão'
    return `${brand} •••• ${card.last4}`
  }

  return {
    // State
    cards,
    isLoading,
    isSaving,
    isFormOpen,
    cardToDelete,
    isDeleteModalOpen: !!cardToDelete,

    // Form
    cardForm,
    handleSubmit: handleSubmit(handleFormSubmit),
    handleFormSubmit,

    // Actions
    handleAddCard,
    handleCloseForm,
    handleDeleteCard,
    handleCloseDeleteModal,
    handleConfirmDeleteCard,

    // Input handlers
    handleCardNumberChange,
    handleExpiryDateChange,
    handleCVVChange,

    // Utilities
    getCardBrand,
    getFormattedCardDisplay,
    watchCardNumber: watch('number'),
  }
}
