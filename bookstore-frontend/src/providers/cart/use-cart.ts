import { useContext } from 'react'

import { CartContext } from './cart-context'
import type { CartContextValue } from './types'

/**
 * Custom hook to access cart context
 * Throws error if used outside CartProvider
 */
export const useCart = (): CartContextValue => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
