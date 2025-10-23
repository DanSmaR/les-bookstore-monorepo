import { useCallback, useState } from 'react'

import type { OrderDTO, PaymentsDTO } from '@/dtos'
import { OrderService } from '@/services'

interface PaymentState {
  isLoading: boolean
  error: string | null
}

/**
 * Payment Hook
 * Manages payment state and provides payment-related functions
 */
export const usePayment = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    error: null,
  })

  /**
   * Pay for an order
   * @param orderId - The ID of the order to pay
   * @param paymentsData - The payments data
   */
  const payOrder = useCallback(
    async (orderId: string, paymentsData: PaymentsDTO): Promise<OrderDTO> => {
      setPaymentState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const updatedOrder = await OrderService.payOrder(orderId, paymentsData)
        setPaymentState((prev) => ({ ...prev, isLoading: false }))
        return updatedOrder
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao processar pagamento'
        setPaymentState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))
        throw error
      }
    },
    [],
  )

  /**
   * Clear payment errors
   */
  const clearErrors = useCallback(() => {
    setPaymentState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    isLoading: paymentState.isLoading,
    error: paymentState.error,
    payOrder,
    clearErrors,
  }
}
