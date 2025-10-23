import { useCallback, useEffect, useMemo, useState } from 'react'

import type { BookDTO, CartItemDTO, CartStateDTO, CartSummaryDTO } from '@/dtos'
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
  })

  const toast = useToast()

  /**
   * Calculate cart summary from items
   */
  const calculateSummary = useCallback(
    (items: CartItemDTO[]): CartSummaryDTO => {
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = items.reduce((sum, item) => {
        const price =
          typeof item.book.price === 'string'
            ? parseFloat(item.book.price)
            : item.book.price
        return sum + price * item.quantity
      }, 0)
      const totalUniqueItems = items.length

      return {
        totalItems,
        totalPrice,
        totalUniqueItems,
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

        // Recalculate summary if items changed
        if (newState.items) {
          updatedState.summary = calculateSummary(newState.items)
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
        const summary = calculateSummary(storedCart.items)
        setCartState({
          ...storedCart,
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

        const summary = calculateSummary(newItems)
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
        const summary = calculateSummary(newItems)

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
        const summary = calculateSummary(newItems)

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
      summary: calculateSummary(cartState.items),
    })
  }, [calculateSummary, cartState.items, saveCartState])

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

        const orderData = { items: orderItems, deliveryAddressId }

        // Create the order
        const createdOrder = await OrderService.createOrder(orderData)

        // Clear cart after successful order creation
        clearCart()

        toast.showSuccess(
          `Pedido realizado com sucesso! Número do pedido: ${createdOrder.id}`,
        )

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
    [cartState.items, clearCart, toast],
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

    // Checkout operations
    checkout,

    // Utility methods
    refreshSummary,
  }

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  )
}
