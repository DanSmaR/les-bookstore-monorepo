import { useCallback, useState } from 'react'

import type { TicketDTO } from '@/dtos'
import { TicketService } from '@/services'
import { ApiError } from '@/services/api-error'

interface UseTicketReturn {
  validateTicket: (
    code: string,
    orderValue: number,
  ) => Promise<{
    success: boolean
    data?: TicketDTO
    error?: string
  }>
  isValidating: boolean
}

export const useTicket = (): UseTicketReturn => {
  const [isValidating, setIsValidating] = useState(false)

  const validateTicket = useCallback(
    async (code: string, orderValue: number) => {
      if (!code.trim()) {
        return {
          success: false,
          error: 'Código do cupom é obrigatório.',
        }
      }

      if (orderValue <= 0) {
        return {
          success: false,
          error: 'Valor do pedido deve ser maior que zero.',
        }
      }

      setIsValidating(true)

      try {
        const ticket = await TicketService.validateTicket(
          code.trim(),
          orderValue,
        )

        return {
          success: true,
          data: ticket,
        }
      } catch (error: unknown) {
        let errorMessage = 'Erro ao validar cupom. Tente novamente.'

        if (error instanceof ApiError) {
          if (error.statusCode === 404 || error.statusCode === 400) {
            errorMessage = 'Cupom já usado, expirado ou inválido.'
          } else if (error.message) {
            errorMessage = error.message
          }
        }

        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setIsValidating(false)
      }
    },
    [],
  )

  return {
    validateTicket,
    isValidating,
  }
}
