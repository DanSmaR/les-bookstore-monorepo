import { useCallback, useState } from 'react'

import type { CardDTO, CreateCardDTO } from '@/dtos/card'
import type { UpdateCardData } from '@/services/card.service'
import { CardService } from '@/services/card.service'

interface CardState {
  cards: CardDTO[]
  isLoading: boolean
  error: string | null
}

interface SingleCardState {
  card: CardDTO | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

/**
 * Card Hook
 * Manages card state and provides card-related functions
 */
export const useCard = () => {
  const [cardState, setCardState] = useState<CardState>({
    cards: [],
    isLoading: false,
    error: null,
  })

  const [singleCardState, setSingleCardState] = useState<SingleCardState>({
    card: null,
    isLoading: false,
    isSaving: false,
    error: null,
  })

  /**
   * Get all user's cards
   */
  const getCards = useCallback(async () => {
    setCardState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const cards = await CardService.getCards()
      setCardState((prev) => ({
        ...prev,
        cards,
        isLoading: false,
      }))
    } catch (error) {
      setCardState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Erro ao carregar cartões',
      }))
    }
  }, [])

  /**
   * Get a specific card by ID
   */
  const getCard = useCallback(async (cardId: string) => {
    setSingleCardState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const card = await CardService.getCard(cardId)
      setSingleCardState((prev) => ({
        ...prev,
        card,
        isLoading: false,
      }))
      return card
    } catch (error) {
      setSingleCardState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Erro ao carregar cartão',
      }))
      throw error
    }
  }, [])

  /**
   * Create a new card
   */
  const createCard = useCallback(async (cardData: CreateCardDTO) => {
    setSingleCardState((prev) => ({ ...prev, isSaving: true, error: null }))

    try {
      const newCard = await CardService.createCard(cardData)

      // Update cards list
      setCardState((prev) => ({
        ...prev,
        cards: [...prev.cards, newCard],
      }))

      setSingleCardState((prev) => ({
        ...prev,
        card: newCard,
        isSaving: false,
      }))

      return newCard
    } catch (error) {
      setSingleCardState((prev) => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Erro ao criar cartão',
      }))
      throw error
    }
  }, [])

  /**
   * Update an existing card
   */
  const updateCard = useCallback(
    async (cardId: string, cardData: UpdateCardData) => {
      setSingleCardState((prev) => ({ ...prev, isSaving: true, error: null }))

      try {
        const updatedCard = await CardService.updateCard(cardId, cardData)

        // Update cards list
        setCardState((prev) => ({
          ...prev,
          cards: prev.cards.map((card) =>
            card.id === cardId ? updatedCard : card,
          ),
        }))

        setSingleCardState((prev) => ({
          ...prev,
          card: updatedCard,
          isSaving: false,
        }))

        return updatedCard
      } catch (error) {
        setSingleCardState((prev) => ({
          ...prev,
          isSaving: false,
          error:
            error instanceof Error ? error.message : 'Erro ao atualizar cartão',
        }))
        throw error
      }
    },
    [],
  )

  /**
   * Delete a card
   */
  const deleteCard = useCallback(async (cardId: string) => {
    try {
      await CardService.deleteCard(cardId)

      // Update cards list
      setCardState((prev) => ({
        ...prev,
        cards: prev.cards.filter((card) => card.id !== cardId),
      }))

      // Clear single card state if it's the deleted card
      setSingleCardState((prev) => ({
        ...prev,
        card: prev.card?.id === cardId ? null : prev.card,
      }))
    } catch (error) {
      setCardState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : 'Erro ao deletar cartão',
      }))
      throw error
    }
  }, [])

  /**
   * Clear errors
   */
  const clearErrors = useCallback(() => {
    setCardState((prev) => ({ ...prev, error: null }))
    setSingleCardState((prev) => ({ ...prev, error: null }))
  }, [])

  /**
   * Clear single card state
   */
  const clearSingleCard = useCallback(() => {
    setSingleCardState({
      card: null,
      isLoading: false,
      isSaving: false,
      error: null,
    })
  }, [])

  return {
    // State
    cards: cardState.cards,
    card: singleCardState.card,
    isLoading: cardState.isLoading || singleCardState.isLoading,
    isSaving: singleCardState.isSaving,
    error: cardState.error || singleCardState.error,

    // Actions
    getCards,
    getCard,
    createCard,
    updateCard,
    deleteCard,
    clearErrors,
    clearSingleCard,
  }
}
