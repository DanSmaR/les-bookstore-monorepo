import { useCallback, useState } from 'react'

import type { MinUserDTO } from '@/dtos/user/min-user'
import type { UserDTO } from '@/dtos/user/user'
import type {
  CreateAddressData,
  GetUsersParams,
  PasswordChangeData,
  UpdateUserData,
} from '@/services/user.service'
import { UserService } from '@/services/user.service'

interface UserState {
  users: MinUserDTO[]
  totalCount: number
  currentPage: number
  pageSize: number
  isLoading: boolean
  error: string | null
}

interface SingleUserState {
  user: UserDTO | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

/**
 * User Hook
 * Manages user state and provides user-related functions
 */
export const useUser = () => {
  const [userState, setUserState] = useState<UserState>({
    users: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    isLoading: false,
    error: null,
  })

  const [singleUserState, setSingleUserState] = useState<SingleUserState>({
    user: null,
    isLoading: false,
    isSaving: false,
    error: null,
  })

  /**
   * Get all users with pagination
   */
  const getAllUsers = useCallback(async (params: GetUsersParams = {}) => {
    setUserState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await UserService.getAllUsers(params)

      setUserState((prev) => ({
        ...prev,
        users: response.items,
        totalCount: response.totalCount,
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        isLoading: false,
        error: null,
      }))

      return { success: true, data: response }
    } catch {
      const errorMessage = 'Erro ao buscar usuários'

      setUserState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))

      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Get user by ID
   */
  const getUserById = useCallback(async (id: string) => {
    setSingleUserState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const user = await UserService.getUserById(id)

      setSingleUserState((prev) => ({
        ...prev,
        user,
        isLoading: false,
        error: null,
      }))

      return { success: true, data: user }
    } catch {
      const errorMessage = 'Erro ao buscar usuário'

      setSingleUserState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))

      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Get current authenticated user
   */
  const getCurrentUser = useCallback(async () => {
    setSingleUserState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const user = await UserService.getCurrentUser()

      setSingleUserState((prev) => ({
        ...prev,
        user,
        isLoading: false,
        error: null,
      }))

      return { success: true, data: user }
    } catch {
      const errorMessage = 'Erro ao buscar dados do usuário'

      setSingleUserState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))

      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Update user
   */
  const updateUser = useCallback(async (userData: UpdateUserData) => {
    setSingleUserState((prev) => ({ ...prev, isSaving: true }))

    try {
      const updatedUser = await UserService.updateUser(userData)

      setSingleUserState((prev) => ({
        ...prev,
        user: updatedUser,
        isSaving: false,
      }))

      return { success: true, data: updatedUser }
    } catch {
      const errorMessage = 'Erro ao atualizar usuário'

      setSingleUserState((prev) => ({
        ...prev,
        isSaving: false,
        error: errorMessage,
      }))

      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Change user password
   */
  const changeUserPassword = useCallback(
    async (passwordData: PasswordChangeData) => {
      setSingleUserState((prev) => ({ ...prev, isSaving: true }))

      try {
        await UserService.changePassword(passwordData)

        setSingleUserState((prev) => ({ ...prev, isSaving: false }))

        return { success: true }
      } catch {
        const errorMessage = 'Erro ao alterar senha'

        setSingleUserState((prev) => ({
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
   * Create user address
   */
  const createUserAddress = useCallback(
    async (addressData: CreateAddressData) => {
      setSingleUserState((prev) => ({ ...prev, isSaving: true }))

      try {
        const newAddress = await UserService.createAddress(addressData)

        setSingleUserState((prev) => ({
          ...prev,
          user: prev.user
            ? {
                ...prev.user,
                addresses: [...prev.user.addresses, newAddress],
              }
            : null,
          isSaving: false,
        }))

        return { success: true, data: newAddress }
      } catch {
        const errorMessage = 'Erro ao criar endereço'

        setSingleUserState((prev) => ({
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
  const updateUserAddress = useCallback(
    async (addressId: string, addressData: Partial<CreateAddressData>) => {
      setSingleUserState((prev) => ({ ...prev, isSaving: true }))

      try {
        const updatedAddress = await UserService.updateAddress(
          addressId,
          addressData,
        )

        setSingleUserState((prev) => ({
          ...prev,
          user: prev.user
            ? {
                ...prev.user,
                addresses: prev.user.addresses.map((addr) =>
                  addr.id === addressId ? updatedAddress : addr,
                ),
              }
            : null,
          isSaving: false,
        }))

        return { success: true, data: updatedAddress }
      } catch {
        const errorMessage = 'Erro ao atualizar endereço'

        setSingleUserState((prev) => ({
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
  const deleteUserAddress = useCallback(async (addressId: string) => {
    setSingleUserState((prev) => ({ ...prev, isSaving: true }))

    try {
      await UserService.deleteAddress(addressId)

      setSingleUserState((prev) => ({
        ...prev,
        user: prev.user
          ? {
              ...prev.user,
              addresses: prev.user.addresses.filter(
                (addr) => addr.id !== addressId,
              ),
            }
          : null,
        isSaving: false,
      }))

      return { success: true }
    } catch {
      const errorMessage = 'Erro ao deletar endereço'

      setSingleUserState((prev) => ({
        ...prev,
        isSaving: false,
        error: errorMessage,
      }))

      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Inactivate user
   */
  const inactivateUser = useCallback(async (userId: string) => {
    setUserState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      await UserService.inactivateUser(userId)

      // Update user list to mark user as inactive
      setUserState((prev) => ({
        ...prev,
        users: prev.users.map((user) =>
          user.id === userId ? { ...user, status: 'Inativo' } : user,
        ),
        isLoading: false,
      }))

      return { success: true }
    } catch {
      const errorMessage = 'Erro ao inativar usuário'

      setUserState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))

      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Clear user error
   */
  const clearError = useCallback(() => {
    setUserState((prev) => ({ ...prev, error: null }))
    setSingleUserState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    // List state
    users: userState.users,
    totalCount: userState.totalCount,
    currentPage: userState.currentPage,
    pageSize: userState.pageSize,
    isLoading: userState.isLoading,
    error: userState.error,

    // Single user state
    user: singleUserState.user,
    isUserLoading: singleUserState.isLoading,
    isSaving: singleUserState.isSaving,
    userError: singleUserState.error,

    // List actions
    getAllUsers,
    clearError,

    // Single user actions
    getUserById,
    getCurrentUser,
    updateUser,
    changeUserPassword,
    createUserAddress,
    updateUserAddress,
    deleteUserAddress,
    inactivateUser,
  }
}
