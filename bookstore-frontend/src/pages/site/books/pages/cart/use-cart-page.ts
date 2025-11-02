import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { TicketDTO } from '@/dtos'
import type { UserDTO } from '@/dtos/user'
import { useUser } from '@/hooks'
import { useAuth, useCart, useToast } from '@/providers'
import { TicketService } from '@/services'

interface UseCartPageReturn {
  // Cart state
  items: ReturnType<typeof useCart>['items']
  summary: ReturnType<typeof useCart>['summary']
  selectedTickets: ReturnType<typeof useCart>['selectedTickets']
  isEmpty: boolean

  // User state
  currentUserWithAddresses: UserDTO | null
  isAuthenticated: boolean

  // Loading states
  isCheckingOut: boolean

  // Modal state
  showAddressModal: boolean

  // Cart operations
  updateQuantity: (bookId: string, quantity: number) => void
  removeItem: (bookId: string) => void

  // Ticket operations
  onToggleTicket: (ticket: TicketDTO) => void
  onClearTickets: () => void

  // Checkout operations
  handleCheckout: () => Promise<void>
  handleAddressSelected: (deliveryAddressId: string) => Promise<void>

  // Modal operations
  setShowAddressModal: (show: boolean) => void
}

export const useCartPage = (): UseCartPageReturn => {
  const {
    items,
    summary,
    updateQuantity,
    removeItem,
    checkout,
    selectedTickets,
    toggleTicketSelection,
    clearSelectedTickets,
    clearCart,
    isEmpty,
  } = useCart()

  const { showSuccess, showError, showInfo } = useToast()
  const { isAuthenticated } = useAuth()
  const { getCurrentUser } = useUser()
  const navigate = useNavigate()

  // Local state
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [currentUserWithAddresses, setCurrentUserWithAddresses] =
    useState<UserDTO | null>(null)

  // Load current user with addresses
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (isAuthenticated && !currentUserWithAddresses) {
        try {
          const result = await getCurrentUser()
          if (result.success && result.data) {
            setCurrentUserWithAddresses(result.data)
          }
        } catch {
          // Silent error handling for user experience
        }
      }
    }

    loadCurrentUser()
  }, [isAuthenticated, currentUserWithAddresses, getCurrentUser])

  // Checkout handler
  const handleCheckout = useCallback(async () => {
    if (!isAuthenticated) {
      showError('Você precisa estar logado para finalizar o pedido.')
      return
    }

    if (
      !currentUserWithAddresses?.addresses ||
      currentUserWithAddresses.addresses.length === 0
    ) {
      showError('Você precisa cadastrar um endereço de entrega.')
      return
    }

    setShowAddressModal(true)
  }, [isAuthenticated, currentUserWithAddresses, showError])

  // Address selection handler
  const handleAddressSelected = useCallback(
    async (deliveryAddressId: string) => {
      setShowAddressModal(false)
      setIsCheckingOut(true)

      try {
        // Step 1: Create order
        const result = await checkout(deliveryAddressId)

        if (!result.success || !result.orderId) {
          showError(result.error || 'Erro ao criar pedido. Tente novamente.')
          return
        }

        // Step 2: Apply selected tickets (if any)
        if (selectedTickets.length > 0) {
          try {
            const ticketCodes = selectedTickets.map((t) => t.code)
            const applyResult = await TicketService.applyTicketsToOrder(
              result.orderId,
              ticketCodes,
            )

            // Show optimization result to user
            if (applyResult.removedTickets.length > 0) {
              showInfo(`Sistema otimizou cupons: ${applyResult.message}`)
            }

            // Show applied tickets info
            if (applyResult.appliedTickets.length > 0) {
              showSuccess(
                `${applyResult.appliedTickets.length} cupom${applyResult.appliedTickets.length > 1 ? 's' : ''} aplicado${applyResult.appliedTickets.length > 1 ? 's' : ''} com sucesso!`,
              )
            }
          } catch (error) {
            console.error('Erro ao aplicar cupons:', error)

            // If ticket application fails, warn user but don't block order
            showInfo(
              'Pedido criado, mas houve erro ao aplicar cupons. Você pode aplicá-los manualmente na página de pedidos.',
            )
          }
        }

        // Step 3: Clear cart and navigate to orders page
        clearCart()
        showSuccess(`Pedido ${result.orderId} criado com sucesso!`)
        navigate('/orders')
      } catch (error) {
        console.error('Erro ao finalizar pedido:', error)
        showError('Erro inesperado ao finalizar pedido. Tente novamente.')
      } finally {
        setIsCheckingOut(false)
      }
    },
    [
      checkout,
      selectedTickets,
      clearCart,
      navigate,
      showSuccess,
      showError,
      showInfo,
    ],
  )

  // Ticket selection handlers
  const handleToggleTicket = useCallback(
    (ticket: TicketDTO) => {
      toggleTicketSelection(ticket)
    },
    [toggleTicketSelection],
  )

  const handleClearTickets = useCallback(() => {
    clearSelectedTickets()
  }, [clearSelectedTickets])

  return {
    // Cart state
    items,
    summary,
    selectedTickets,
    isEmpty,

    // User state
    currentUserWithAddresses,
    isAuthenticated,

    // Loading states
    isCheckingOut,

    // Modal state
    showAddressModal,

    // Cart operations
    updateQuantity,
    removeItem,

    // Ticket operations
    onToggleTicket: handleToggleTicket,
    onClearTickets: handleClearTickets,

    // Checkout operations
    handleCheckout,
    handleAddressSelected,

    // Modal operations
    setShowAddressModal,
  }
}
