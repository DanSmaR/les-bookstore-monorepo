import { useCallback, useEffect, useState } from 'react'

import { useAddress, useUser } from '@/hooks'
import { useAuth, useToast } from '@/providers'
import type { CreateAddressData, UpdateUserData } from '@/services/user.service'

import type { Address, Customer, PasswordChangeData } from './types'

export interface UseProfileEditReturn {
  // Estado principal
  customer: Customer | null
  loading: boolean
  saving: boolean
  hasLoadError: boolean

  // Edição de perfil
  saveProfile: (profileData?: Partial<Customer>) => Promise<void>

  // Gerenciamento de endereços
  editingAddress: Address | null
  addressFormData: Partial<Address>
  setAddressFormData: (data: Partial<Address>) => void
  startAddingAddress: () => void
  startEditingAddress: (address: Address) => void
  saveAddress: (addressData?: Partial<Address>) => Promise<void>
  removeAddress: (addressId: string) => Promise<void>
  cancelAddressEditing: () => void

  // Alteração de senha
  passwordFormData: PasswordChangeData
  setPasswordFormData: (data: PasswordChangeData) => void
  changePassword: () => Promise<void>

  // Funções de carregamento
  loadProfile: () => Promise<void>
}

export const useProfileEdit = (): UseProfileEditReturn => {
  // Get authenticated user from AuthProvider
  const { isAuthenticated } = useAuth()
  // Entity hooks
  const userHook = useUser()
  const addressHook = useAddress()
  const toast = useToast()

  // Estados principais
  const [loading, setLoading] = useState(false)
  const [hasLoadError, setHasLoadError] = useState(false)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)

  // Estados de endereços
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressFormData, setAddressFormData] = useState<Partial<Address>>({})

  // Estado de senha
  const [passwordFormData, setPasswordFormData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Get customer data from user hook
  const customer = userHook.user as Customer | null
  const saving = userHook.isSaving || addressHook.isAddressSaving

  // Carregamento inicial do perfil
  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) {
      toast.showError('Usuário não autenticado')
      return
    }

    setLoading(true)
    setHasLoadError(false) // Reset error state when starting a new load

    try {
      // Use getCurrentUser to get the current authenticated user
      const result = await userHook.getCurrentUser()

      if (result.success && result.data) {
        setHasLoadError(false)
        if (!hasInitialLoad) {
          setHasInitialLoad(true)
        }
      } else {
        setHasLoadError(true)
        toast.showError(result.error || 'Erro ao carregar dados do perfil')
      }
    } catch {
      setHasLoadError(true)
      toast.showError('Erro ao carregar dados do perfil')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, userHook, toast, hasInitialLoad])

  useEffect(() => {
    if (isAuthenticated && !hasInitialLoad) {
      setHasInitialLoad(true)
      loadProfile()
    }
  }, [isAuthenticated, hasInitialLoad, loadProfile]) // Fixed dependencies

  const saveProfile = useCallback(
    async (profileData?: Partial<Customer>) => {
      if (!customer || !profileData?.id) return

      try {
        const result = await userHook.updateUser(profileData as UpdateUserData)

        if (result.success) {
          toast.showSuccess('Perfil atualizado com sucesso!')
        } else {
          toast.showError(result.error || 'Erro ao atualizar perfil')
        }
      } catch {
        toast.showError('Erro ao atualizar perfil')
      }
    },
    [customer, userHook, toast],
  )

  // Funções de endereços
  const startAddingAddress = useCallback(() => {
    setEditingAddress(null)
    setAddressFormData({
      type: 'house',
      addressName: '',
      postalCode: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
    })
  }, [])

  const startEditingAddress = useCallback((address: Address) => {
    setEditingAddress(address)
    setAddressFormData({ ...address })
  }, [])

  const cancelAddressEditing = useCallback(() => {
    setEditingAddress(null)
    setAddressFormData({})
  }, [])

  const saveAddress = useCallback(
    async (addressDataParam?: Partial<Address>) => {
      if (!customer) return

      const dataToSave = addressDataParam || addressFormData
      if (!dataToSave) return

      // Validate that we have all required fields
      const requiredFields = [
        'type',
        'purpose',
        'addressName',
        'postalCode',
        'street',
        'number',
        'district',
        'city',
        'state',
      ]

      const hasAllFields = requiredFields.every((field) => dataToSave[field])

      if (!hasAllFields) {
        console.error('Missing required fields:', {
          provided: dataToSave,
          required: requiredFields,
        })
        toast.showError('Por favor, preencha todos os campos obrigatórios')
        return
      }

      // Ensure we're sending a proper address object, not the ID
      const addressPayload = {
        type: dataToSave.type,
        purpose: dataToSave.purpose,
        addressName: dataToSave.addressName,
        postalCode: dataToSave.postalCode,
        street: dataToSave.street,
        number: dataToSave.number,
        complement: dataToSave.complement,
        district: dataToSave.district,
        city: dataToSave.city,
        state: dataToSave.state,
      }

      try {
        if (editingAddress) {
          const result = await addressHook.updateAddress(
            customer.id,
            editingAddress.id,
            addressPayload as CreateAddressData, // Send only the address data, not the ID
          )

          if (result.success) {
            toast.showSuccess('Endereço atualizado com sucesso!')
            // Refresh the user data to get the updated address
            await userHook.getCurrentUser()
          } else {
            toast.showError(result.error || 'Erro ao atualizar endereço')
          }
        } else {
          const result = await addressHook.createAddress(
            customer.id,
            addressPayload as CreateAddressData,
          )

          if (result.success) {
            toast.showSuccess('Endereço adicionado com sucesso!')
            await userHook.getCurrentUser()
          } else {
            toast.showError(result.error || 'Erro ao adicionar endereço')
          }
        }

        cancelAddressEditing()
      } catch (error) {
        console.error('Error saving address:', error)
        toast.showError(
          editingAddress
            ? 'Erro ao atualizar endereço'
            : 'Erro ao adicionar endereço',
        )
      }
    },
    [
      customer,
      addressFormData,
      editingAddress,
      cancelAddressEditing,
      toast,
      addressHook,
      userHook,
    ],
  )

  const removeAddress = useCallback(
    async (addressId: string) => {
      if (!customer) return

      // Verificar se não é o último endereço residencial
      const address = customer.addresses?.find((addr) => addr.id === addressId)
      const residentialAddresses = customer.addresses?.filter(
        (addr) => addr.type === 'house',
      )

      if (
        address?.type === 'house' &&
        residentialAddresses &&
        residentialAddresses.length <= 1
      ) {
        toast.showError('Não é possível remover o único endereço residencial')
        return
      }

      try {
        const result = await addressHook.deleteAddress(customer.id, addressId)

        if (result.success) {
          // Reload user data to get updated addresses
          await userHook.getUserById(customer.id)
          toast.showSuccess('Endereço removido com sucesso!')
        } else {
          toast.showError(result.error || 'Erro ao remover endereço')
        }
      } catch {
        toast.showError('Erro ao remover endereço')
      }
    },
    [customer, toast, addressHook, userHook],
  )

  // Função de alteração de senha
  const changePassword = useCallback(async () => {
    if (!customer) return

    // Validações
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.showError('As senhas não coincidem')
      return
    }

    // Validar força da senha
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(passwordFormData.newPassword)) {
      toast.showError(
        'A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial',
      )
      return
    }

    try {
      const result = await userHook.changeUserPassword(passwordFormData)

      if (result.success) {
        setPasswordFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        toast.showSuccess('Senha alterada com sucesso!')
      } else {
        toast.showError(
          result.error || 'Erro ao alterar senha. Verifique a senha atual.',
        )
      }
    } catch {
      toast.showError('Erro ao alterar senha. Verifique a senha atual.')
    }
  }, [customer, passwordFormData, toast, userHook])

  return {
    // Estado principal
    customer,
    loading,
    saving,
    hasLoadError,

    // Edição de perfil
    saveProfile,

    // Gerenciamento de endereços
    editingAddress,
    addressFormData,
    setAddressFormData,
    startAddingAddress,
    startEditingAddress,
    saveAddress,
    removeAddress,
    cancelAddressEditing,

    // Alteração de senha
    passwordFormData,
    setPasswordFormData,
    changePassword,

    // Funções de carregamento
    loadProfile,
  }
}
