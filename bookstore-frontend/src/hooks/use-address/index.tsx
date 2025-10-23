import { useCallback, useState } from 'react'

import type { AddressDTO } from '@/dtos/user/address'
import type { CreateAddressData } from '@/services/user.service'
import { UserService } from '@/services/user.service'

interface AddressState {
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

/**
 * Address Entity Hook
 * Manages all address-related operations
 */
export const useAddress = () => {
  const [addressState, setAddressState] = useState<AddressState>({
    isLoading: false,
    isSaving: false,
    error: null,
  })

  /**
   * Create user address
   */
  const createAddress = useCallback(
    async (userId: string, addressData: CreateAddressData) => {
      setAddressState((prev) => ({ ...prev, isSaving: true, error: null }))

      try {
        const newAddress = await UserService.createAddress(addressData)

        setAddressState((prev) => ({ ...prev, isSaving: false }))

        return { success: true, data: newAddress }
      } catch {
        const errorMessage = 'Erro ao criar endereço'

        setAddressState((prev) => ({
          ...prev,
          isSaving: false,
          error: errorMessage,
        }))

        return { success: false, error: errorMessage }
      }
    },
    [],
  )

  /**
   * Update user address
   */
  const updateAddress = useCallback(
    async (
      userId: string,
      addressId: string,
      addressData: Partial<CreateAddressData>,
    ) => {
      setAddressState((prev) => ({ ...prev, isSaving: true, error: null }))

      try {
        const updatedAddress = await UserService.updateAddress(
          addressId,
          addressData,
        )

        setAddressState((prev) => ({ ...prev, isSaving: false }))

        return { success: true, data: updatedAddress }
      } catch {
        const errorMessage = 'Erro ao atualizar endereço'

        setAddressState((prev) => ({
          ...prev,
          isSaving: false,
          error: errorMessage,
        }))

        return { success: false, error: errorMessage }
      }
    },
    [],
  )

  /**
   * Delete user address
   */
  const deleteAddress = useCallback(
    async (userId: string, addressId: string) => {
      setAddressState((prev) => ({ ...prev, isSaving: true, error: null }))

      try {
        await UserService.deleteAddress(addressId)

        setAddressState((prev) => ({ ...prev, isSaving: false }))

        return { success: true }
      } catch {
        const errorMessage = 'Erro ao deletar endereço'

        setAddressState((prev) => ({
          ...prev,
          isSaving: false,
          error: errorMessage,
        }))

        return { success: false, error: errorMessage }
      }
    },
    [],
  )

  /**
   * Get user addresses
   */
  const getUserAddresses = useCallback(async (userId: string) => {
    setAddressState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const addresses = await UserService.getUserAddresses()

      setAddressState((prev) => ({ ...prev, isLoading: false }))

      return { success: true, data: addresses }
    } catch {
      const errorMessage = 'Erro ao buscar endereços'

      setAddressState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))

      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Validate address business rules
   */
  const validateAddressRemoval = useCallback(
    (addresses: AddressDTO[], addressToRemove: AddressDTO) => {
      const residentialAddresses = addresses.filter(
        (addr) => addr.type === 'house',
      )

      if (
        addressToRemove.type === 'house' &&
        residentialAddresses.length <= 1
      ) {
        return {
          isValid: false,
          error: 'Não é possível remover o único endereço residencial',
        }
      }

      return { isValid: true }
    },
    [],
  )

  /**
   * Clear address errors
   */
  const clearError = useCallback(() => {
    setAddressState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    // State
    isAddressLoading: addressState.isLoading,
    isAddressSaving: addressState.isSaving,
    addressError: addressState.error,

    // Operations
    createAddress,
    updateAddress,
    deleteAddress,
    getUserAddresses,

    // Business rules
    validateAddressRemoval,

    // State management
    clearError,
  }
}
