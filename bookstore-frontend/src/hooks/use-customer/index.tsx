import { useCallback, useState } from 'react'

import type { CustomerDTO } from '@/dtos/user/customer.dto'
import { UserService } from '@/services/user.service'

interface CustomerState {
  customer: CustomerDTO | null
  isLoading: boolean
  error: string | null
}

/**
 * Customer Hook for Admin Operations
 * Handles customer-related operations for admin panel
 */
export const useCustomer = () => {
  const [customerState, setCustomerState] = useState<CustomerState>({
    customer: null,
    isLoading: false,
    error: null,
  })

  /**
   * Get customer by ID (Admin)
   */
  const getCustomerById = useCallback(async (id: string) => {
    setCustomerState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const customer = await UserService.getUserById(id)

      setCustomerState({
        customer,
        isLoading: false,
        error: null,
      })

      return { success: true, data: customer }
    } catch {
      const errorMessage = 'Erro ao buscar cliente'

      setCustomerState({
        customer: null,
        isLoading: false,
        error: errorMessage,
      })

      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setCustomerState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    customer: customerState.customer,
    isCustomerLoading: customerState.isLoading,
    customerError: customerState.error,
    getCustomerById,
    clearError,
  }
}
