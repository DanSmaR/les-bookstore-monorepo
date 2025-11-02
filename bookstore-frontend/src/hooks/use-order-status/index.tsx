import { useState } from 'react'

import type { OrderStatusType } from '@/dtos'
import { useToast } from '@/providers'
import { OrderService } from '@/services'

export const useOrderStatus = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { showSuccess, showError } = useToast()

  const changeOrderStatus = async (
    orderId: string,
    newStatus: OrderStatusType,
  ) => {
    setIsLoading(true)
    try {
      await OrderService.changeOrderStatus(orderId, { status: newStatus })

      showSuccess('O status do pedido foi atualizado com sucesso.')
    } catch (error) {
      showError(
        'Não foi possível atualizar o status do pedido. Tente novamente.',
      )

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    changeOrderStatus,
    isLoading,
  }
}
