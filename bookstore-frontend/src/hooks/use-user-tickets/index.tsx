import { useCallback, useState } from 'react'

import type { TicketDTO } from '@/dtos'
import { TicketService } from '@/services'
import { ApiError } from '@/services/api-error'

interface UseUserTicketsReturn {
  tickets: TicketDTO[]
  isLoading: boolean
  error: string | null
  loadUserTickets: () => Promise<void>
}

export const useUserTickets = (): UseUserTicketsReturn => {
  const [tickets, setTickets] = useState<TicketDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUserTickets = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const userTickets = await TicketService.getUserTickets()
      // Only show active tickets
      const activeTickets = userTickets.filter((t) => t.status === 'active')
      setTickets(activeTickets)
    } catch (err) {
      let errorMessage = 'Erro ao carregar cupons disponíveis.'

      if (err instanceof ApiError) {
        errorMessage = err.message || errorMessage
      }

      setError(errorMessage)
      setTickets([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    tickets,
    isLoading,
    error,
    loadUserTickets,
  }
}
