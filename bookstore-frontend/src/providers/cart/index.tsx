import { useCallback, useEffect, useMemo, useState } from 'react'

import type {
  BookDTO,
  CartItemDTO,
  CartStateDTO,
  CartSummaryDTO,
  TicketDTO,
} from '@/dtos'
import { useToast } from '@/providers'
import { OrderService } from '@/services'
import { CartStorage } from '@/storage'

import { CartContext } from './cart-context'
import type { CartProviderProps } from './types'

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartState, setCartState] = useState<CartStateDTO>({
    items: [],
    summary: {
      totalItems: 0,
      totalPrice: 0,
      totalUniqueItems: 0,
    },
    lastUpdated: new Date(),
    isLoading: true,
    selectedTickets: [],
    appliedTicketsResult: undefined,
  })

  const toast = useToast()

  /**
   * Calculate cart summary from items and selected tickets
   * This is a PREVIEW estimation - final discount is calculated by backend
   */
  const calculateSummary = useCallback(
    (items: CartItemDTO[], selectedTickets: TicketDTO[]): CartSummaryDTO => {
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      const originalPrice = items.reduce((sum, item) => {
        const price =
          typeof item.book.price === 'string'
            ? parseFloat(item.book.price)
            : item.book.price
        return sum + price * item.quantity
      }, 0)
      const totalUniqueItems = items.length

      // If no tickets selected, return original price
      if (!selectedTickets || selectedTickets.length === 0) {
        return {
          totalItems,
          totalPrice: originalPrice,
          totalUniqueItems,
          originalPrice,
          discount: 0,
        }
      }

      // Estimate discount (preview only - backend will optimize)
      let estimatedDiscount = 0
      let remainingAmount = originalPrice

      // Apply promotional tickets first
      const promotionalTickets = selectedTickets.filter(
        (t) => t.nature === 'promotional',
      )
      const exchangeTickets = selectedTickets.filter(
        (t) => t.nature === 'exchange',
      )

      // Apply first promotional ticket (backend enforces max 1)
      if (promotionalTickets.length > 0) {
        const ticket = promotionalTickets[0]
        let ticketDiscount = 0

        if (ticket.type === 'percentage') {
          ticketDiscount = (remainingAmount * ticket.value) / 100
        } else {
          // raw value
          ticketDiscount = ticket.value
        }

        // Apply max discount limit if exists
        if (ticket.maxDiscount && ticketDiscount > ticket.maxDiscount) {
          ticketDiscount = ticket.maxDiscount
        }

        estimatedDiscount += Math.min(ticketDiscount, remainingAmount)
        remainingAmount -= ticketDiscount
      }

      // Apply exchange tickets
      for (const ticket of exchangeTickets) {
        if (remainingAmount <= 0) break
        const ticketValue = Math.min(ticket.value, remainingAmount)
        estimatedDiscount += ticketValue
        remainingAmount -= ticketValue
      }

      // Ensure discount doesn't exceed original price
      estimatedDiscount = Math.min(estimatedDiscount, originalPrice)
      const finalPrice = Math.max(0, originalPrice - estimatedDiscount)

      return {
        totalItems,
        totalPrice: finalPrice,
        totalUniqueItems,
        originalPrice,
        discount: estimatedDiscount,
      }
    },
    [],
  )

  /**
   * Save cart state to localStorage and update state
   */
  const saveCartState = useCallback(
    (newState: Partial<CartStateDTO>) => {
      setCartState((prevState) => {
        const updatedState: CartStateDTO = {
          ...prevState,
          ...newState,
          lastUpdated: new Date(),
        }

        // Recalculate summary if items or tickets changed
        if (
          newState.items !== undefined ||
          newState.selectedTickets !== undefined
        ) {
          updatedState.summary = calculateSummary(
            newState.items || prevState.items,
            newState.selectedTickets !== undefined
              ? newState.selectedTickets
              : prevState.selectedTickets,
          )
        }

        // Save to localStorage
        CartStorage.setCartState(updatedState)

        return updatedState
      })
    },
    [calculateSummary],
  )

  /**
   * Load cart from localStorage on initialization
   */
  const loadCartFromStorage = useCallback(() => {
    try {
      const storedCart = CartStorage.getCartState()
      if (storedCart) {
        // Recalculate summary to ensure consistency
        const summary = calculateSummary(
          storedCart.items,
          storedCart.selectedTickets || [],
        )
        setCartState({
          ...storedCart,
          selectedTickets: storedCart.selectedTickets || [],
          summary,
          isLoading: false,
        })
      } else {
        setCartState((prev) => ({ ...prev, isLoading: false }))
      }
    } catch {
      // Failed to load cart from storage
      setCartState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [calculateSummary])

  /**
   * Add item to cart or increment quantity if already exists
   */
  const addItem = useCallback(
    (book: BookDTO, quantity: number = 1) => {
      setCartState((prevState) => {
        const existingItemIndex = prevState.items.findIndex(
          (item) => item.bookId === book.id,
        )

        let newItems: CartItemDTO[]

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          newItems = prevState.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
          toast.showSuccess(`Quantidade atualizada no carrinho: ${book.title}`)
        } else {
          // Add new item
          const newItem: CartItemDTO = {
            bookId: book.id,
            book,
            quantity,
            addedAt: new Date(),
          }
          newItems = [...prevState.items, newItem]
          toast.showSuccess(`Adicionado ao carrinho: ${book.title}`)
        }

        const summary = calculateSummary(newItems, prevState.selectedTickets)
        const updatedState: CartStateDTO = {
          ...prevState,
          items: newItems,
          summary,
          lastUpdated: new Date(),
        }

        // Save to localStorage
        CartStorage.setCartState(updatedState)

        return updatedState
      })
    },
    [calculateSummary, toast],
  )

  /**
   * Remove item completely from cart
   */
  const removeItem = useCallback(
    (bookId: string) => {
      setCartState((prevState) => {
        const itemToRemove = prevState.items.find(
          (item) => item.bookId === bookId,
        )
        const newItems = prevState.items.filter(
          (item) => item.bookId !== bookId,
        )
        const summary = calculateSummary(newItems, prevState.selectedTickets)

        const updatedState: CartStateDTO = {
          ...prevState,
          items: newItems,
          summary,
          lastUpdated: new Date(),
        }

        // Save to localStorage
        CartStorage.setCartState(updatedState)

        if (itemToRemove) {
          toast.showSuccess(`Removido do carrinho: ${itemToRemove.book.title}`)
        }

        return updatedState
      })
    },
    [calculateSummary, toast],
  )

  /**
   * Update item quantity in cart
   */
  const updateQuantity = useCallback(
    (bookId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(bookId)
        return
      }

      setCartState((prevState) => {
        const newItems = prevState.items.map((item) =>
          item.bookId === bookId ? { ...item, quantity } : item,
        )
        const summary = calculateSummary(newItems, prevState.selectedTickets)

        const updatedState: CartStateDTO = {
          ...prevState,
          items: newItems,
          summary,
          lastUpdated: new Date(),
        }

        // Save to localStorage
        CartStorage.setCartState(updatedState)

        return updatedState
      })
    },
    [calculateSummary, removeItem],
  )

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    const updatedState: CartStateDTO = {
      items: [],
      summary: {
        totalItems: 0,
        totalPrice: 0,
        totalUniqueItems: 0,
      },
      lastUpdated: new Date(),
      isLoading: false,
      selectedTickets: [],
      appliedTicketsResult: undefined,
    }

    setCartState(updatedState)
    CartStorage.setCartState(updatedState)
    toast.showSuccess('Carrinho limpo com sucesso')
  }, [toast])

  /**
   * Get specific item from cart
   */
  const getItem = useCallback(
    (bookId: string): CartItemDTO | undefined => {
      return cartState.items.find((item) => item.bookId === bookId)
    },
    [cartState.items],
  )

  /**
   * Check if item exists in cart
   */
  const hasItem = useCallback(
    (bookId: string): boolean => {
      return cartState.items.some((item) => item.bookId === bookId)
    },
    [cartState.items],
  )

  /**
   * Refresh cart summary (useful for debugging)
   */
  const refreshSummary = useCallback(() => {
    saveCartState({
      summary: calculateSummary(cartState.items, cartState.selectedTickets),
    })
  }, [
    calculateSummary,
    cartState.items,
    cartState.selectedTickets,
    saveCartState,
  ])

  /**
   * Checkout - Create order from cart items
   */
  const checkout = useCallback(
    async (deliveryAddressId: string) => {
      if (cartState.items.length === 0) {
        return {
          success: false,
          error: 'Carrinho vazio. Adicione itens antes de finalizar o pedido.',
        }
      }

      if (!deliveryAddressId) {
        return {
          success: false,
          error: 'Endereço de entrega é obrigatório.',
        }
      }

      try {
        // Convert cart items to order format
        const orderItems = cartState.items.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        }))

        const orderData = {
          items: orderItems,
          deliveryAddressId,
          // ticketId removed - tickets will be applied via separate API call after order creation
        }

        // Create the order (without tickets - they'll be applied separately)
        const createdOrder = await OrderService.createOrder(orderData)

        // Note: Cart is NOT cleared here - will be cleared after successful ticket application
        // This allows preserving selected tickets for the apply-tickets API call

        return {
          success: true,
          orderId: createdOrder.id,
        }
      } catch {
        const errorMessage =
          'Erro ao finalizar pedido. Tente novamente ou entre em contato com o suporte.'

        toast.showError(errorMessage)

        return {
          success: false,
          error: errorMessage,
        }
      }
    },
    [cartState.items, toast],
  )

  /**
   * Select tickets for cart (replace all selected tickets)
   */
  const selectTickets = useCallback(
    (tickets: TicketDTO[]) => {
      saveCartState({ selectedTickets: tickets })
      if (tickets.length > 0) {
        toast.showSuccess(
          `${tickets.length} cupom${tickets.length > 1 ? 's' : ''} selecionado${tickets.length > 1 ? 's' : ''}`,
        )
      }
    },
    [saveCartState, toast],
  )

  /**
   * Clear all selected tickets
   */
  const clearSelectedTickets = useCallback(() => {
    const count = cartState.selectedTickets.length
    saveCartState({ selectedTickets: [], appliedTicketsResult: undefined })
    if (count > 0) {
      toast.showSuccess('Cupons removidos')
    }
  }, [cartState.selectedTickets.length, saveCartState, toast])

  /**
   * Toggle ticket selection (add if not selected, remove if already selected)
   */
  const toggleTicketSelection = useCallback(
    (ticket: TicketDTO) => {
      const isSelected = cartState.selectedTickets.some(
        (t) => t.id === ticket.id,
      )

      if (isSelected) {
        // Remove ticket
        const newTickets = cartState.selectedTickets.filter(
          (t) => t.id !== ticket.id,
        )
        saveCartState({ selectedTickets: newTickets })
        toast.showSuccess(`Cupom "${ticket.code}" removido`)
      } else {
        // Add ticket
        const newTickets = [...cartState.selectedTickets, ticket]
        saveCartState({ selectedTickets: newTickets })
        toast.showSuccess(`Cupom "${ticket.code}" selecionado`)
      }
    },
    [cartState.selectedTickets, saveCartState, toast],
  )

  // Computed properties
  const isEmpty = useMemo(() => cartState.items.length === 0, [cartState.items])
  const totalItems = useMemo(
    () => cartState.summary.totalItems,
    [cartState.summary.totalItems],
  )
  const totalPrice = useMemo(
    () => cartState.summary.totalPrice,
    [cartState.summary.totalPrice],
  )
  const totalUniqueItems = useMemo(
    () => cartState.summary.totalUniqueItems,
    [cartState.summary.totalUniqueItems],
  )

  // Load cart from storage on mount
  useEffect(() => {
    loadCartFromStorage()
  }, [loadCartFromStorage])

  const contextValue = {
    // State
    items: cartState.items,
    summary: cartState.summary,
    isLoading: cartState.isLoading,
    lastUpdated: cartState.lastUpdated,
    selectedTickets: cartState.selectedTickets,
    appliedTicketsResult: cartState.appliedTicketsResult,

    // Computed properties
    isEmpty,
    totalItems,
    totalPrice,
    totalUniqueItems,

    // Cart operations
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
    hasItem,

    // Ticket operations
    selectTickets,
    clearSelectedTickets,
    toggleTicketSelection,

    // Checkout operations
    checkout,

    // Utility methods
    refreshSummary,
  }

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  )
}
