import type { BookDTO, CartStateDTO } from '@/dtos'

const CART_STORAGE_KEY = 'bookstore-cart'

interface StoredCartItem {
  bookId: string
  book: BookDTO
  quantity: number
  addedAt: string
}

interface StoredCartState {
  items: StoredCartItem[]
  summary: {
    totalItems: number
    totalPrice: number
    totalUniqueItems: number
  }
  lastUpdated: string
  isLoading: boolean
}

/**
 * Cart Storage Utilities
 * Provides type-safe localStorage operations for cart data
 */
export class CartStorage {
  /**
   * Store cart state in localStorage
   */
  static setCartState(cartState: CartStateDTO): void {
    try {
      const serializedCart: StoredCartState = {
        ...cartState,
        lastUpdated: cartState.lastUpdated.toISOString(),
        items: cartState.items.map((item) => ({
          ...item,
          addedAt: item.addedAt.toISOString(),
        })),
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializedCart))
    } catch {
      // Silent fail - storage not available
    }
  }

  /**
   * Retrieve cart state from localStorage
   */
  static getCartState(): CartStateDTO | null {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (!storedCart) {
        return null
      }

      const parsed: StoredCartState = JSON.parse(storedCart)

      // Convert date strings back to Date objects
      return {
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated),
        items: parsed.items.map((item) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        })),
      } as CartStateDTO
    } catch {
      // Clear corrupted cart data
      CartStorage.removeCartState()
      return null
    }
  }

  /**
   * Remove cart state from localStorage
   */
  static removeCartState(): void {
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch {
      // Silent fail - storage not available
    }
  }

  /**
   * Check if cart state exists in localStorage
   */
  static hasCartState(): boolean {
    try {
      return localStorage.getItem(CART_STORAGE_KEY) !== null
    } catch {
      return false
    }
  }

  /**
   * Get cart storage size in bytes (for debugging)
   */
  static getStorageSize(): number {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY)
      return cartData ? cartData.length * 2 : 0 // Approximate size in bytes
    } catch {
      return 0
    }
  }

  /**
   * Clear all cart-related storage (useful for testing)
   */
  static clearAll(): void {
    CartStorage.removeCartState()
  }
}
