import { useEffect } from 'react'

import type { CustomerDTO } from '@/dtos/user/customer.dto'
import { useCustomer } from '@/hooks'
import { useToast } from '@/providers/toast/use-toast'

interface UseCustomerDetailsReturn {
  customer: CustomerDTO | null
  isLoading: boolean
  error: string | null
}

export const useCustomerDetails = (
  customerId: string,
): UseCustomerDetailsReturn => {
  const {
    customer,
    isCustomerLoading,
    customerError,
    getCustomerById,
    clearError,
  } = useCustomer()
  const { addToast } = useToast()

  useEffect(() => {
    const loadCustomerDetails = async () => {
      if (!customerId) {
        addToast('ID do cliente não fornecido', 'error')
        return
      }

      try {
        clearError()
        const result = await getCustomerById(customerId)

        if (!result.success && result.error) {
          addToast(result.error, 'error')
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Erro ao carregar dados do cliente'

        addToast(errorMessage, 'error')
      }
    }

    loadCustomerDetails()
  }, [customerId, getCustomerById, addToast, clearError])

  return {
    customer,
    isLoading: isCustomerLoading,
    error: customerError,
  }
}
