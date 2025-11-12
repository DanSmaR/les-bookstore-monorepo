import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Plus } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Form, FormField, Modal } from '@/components'
import type { AddressDTO } from '@/dtos'
import { useAddress } from '@/hooks'
import { useAuth, useToast } from '@/providers'
import {
  type AddressFormData,
  addressFormSchema,
} from '@/schemas/profile-schemas'
import type { CreateAddressData } from '@/services/user.service'
import {
  addressPurposeOptions,
  residenceTypeOptions,
  stateOptions,
} from '@/utils/constants'
import { convertFromMaskedFormat } from '@/utils/input-masks'

import { AddressCard } from '../AddressCard'
import * as S from './styles'

interface AddressSelectionModalProps {
  isOpen: boolean
  addresses: AddressDTO[]
  onClose: () => void
  onConfirm: (selectedAddressId: string) => void
  onAddressCreated?: () => void
}

export const AddressSelectionModal = ({
  isOpen,
  addresses,
  onClose,
  onConfirm,
  onAddressCreated,
}: AddressSelectionModalProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const { user: currentUser } = useAuth()
  const { createAddress } = useAddress()
  const { showSuccess, showError } = useToast()

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    mode: 'onChange',
    defaultValues: {
      type: '',
      purpose: 'delivery',
      addressName: '',
      postalCode: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
    },
  })

  // Reset form when closing
  useEffect(() => {
    if (!showAddForm) {
      addressForm.reset()
    }
  }, [showAddForm, addressForm])

  const handleConfirm = () => {
    if (selectedAddressId) {
      onConfirm(selectedAddressId)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedAddressId('')
    setShowAddForm(false)
    addressForm.reset()
    onClose()
  }

  const handleAddAddress = async (data: AddressFormData) => {
    if (!currentUser?.id) {
      showError('Usuário não autenticado')
      return
    }

    try {
      const convertedData = {
        ...data,
        postalCode: convertFromMaskedFormat.zipCode(data.postalCode),
        type: data.type as CreateAddressData['type'],
        purpose: data.purpose as CreateAddressData['purpose'],
      }

      const result = await createAddress(currentUser.id, convertedData)

      if (result.success && result.data) {
        showSuccess('Endereço adicionado com sucesso!')
        setShowAddForm(false)
        addressForm.reset()
        // Refresh addresses list
        if (onAddressCreated) {
          onAddressCreated()
        }
        // Auto-select the newly created address
        setSelectedAddressId(result.data.id)
      } else {
        showError(result.error || 'Erro ao criar endereço')
      }
    } catch {
      showError('Erro inesperado ao criar endereço')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <S.ModalContent>
        <S.Header>
          <S.Title>Selecionar Endereço de Entrega</S.Title>
          <S.Subtitle>
            Escolha o endereço onde deseja receber seus livros
          </S.Subtitle>
        </S.Header>

        <S.AddressesSection>
          {showAddForm ? (
            <S.AddressFormContainer>
              <S.FormTitle>Adicionar Novo Endereço</S.FormTitle>
              <Form
                form={addressForm}
                onSubmit={handleAddAddress}
                data-testid="address-form"
              >
                <S.FormSectionWrapper>
                  <S.FormGrid>
                    <FormField
                      form={addressForm}
                      name="addressName"
                      type="text"
                      label="Nome do Endereço"
                      placeholder="Ex: Casa, Trabalho, Apartamento..."
                    />

                    <FormField
                      form={addressForm}
                      name="type"
                      type="select"
                      label="Tipo de Residência"
                      placeholder="Selecione o tipo"
                      options={residenceTypeOptions}
                    />

                    <FormField
                      form={addressForm}
                      name="purpose"
                      type="select"
                      label="Finalidade"
                      placeholder="Selecione a finalidade"
                      options={addressPurposeOptions}
                    />

                    <FormField
                      form={addressForm}
                      name="postalCode"
                      type="zipCode"
                      label="CEP"
                      placeholder="00000-000"
                    />

                    <FormField
                      form={addressForm}
                      name="street"
                      type="text"
                      label="Rua"
                      placeholder="Nome da rua"
                    />

                    <FormField
                      form={addressForm}
                      name="number"
                      type="text"
                      label="Número"
                      placeholder="Número da residência"
                    />

                    <FormField
                      form={addressForm}
                      name="complement"
                      type="text"
                      label="Complemento"
                      placeholder="Apartamento, bloco, etc. (opcional)"
                    />

                    <FormField
                      form={addressForm}
                      name="district"
                      type="text"
                      label="Bairro"
                      placeholder="Nome do bairro"
                    />

                    <FormField
                      form={addressForm}
                      name="city"
                      type="text"
                      label="Cidade"
                      placeholder="Nome da cidade"
                    />

                    <FormField
                      form={addressForm}
                      name="state"
                      type="select"
                      label="Estado"
                      placeholder="Selecione o estado"
                      options={stateOptions}
                    />
                  </S.FormGrid>
                </S.FormSectionWrapper>

                <S.FormActions>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddForm(false)}
                    disabled={addressForm.formState.isSubmitting}
                    data-testid="cancel-add-address-button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={addressForm.formState.isSubmitting}
                    data-testid="save-address-button"
                  >
                    Adicionar Endereço
                  </Button>
                </S.FormActions>
              </Form>
            </S.AddressFormContainer>
          ) : (
            <>
              {addresses.length === 0 ? (
                <S.EmptyState>
                  <S.EmptyIcon>
                    <MapPin size={32} />
                  </S.EmptyIcon>
                  <S.EmptyTitle>Nenhum endereço cadastrado</S.EmptyTitle>
                  <S.EmptyDescription>
                    Você precisa ter pelo menos um endereço cadastrado para
                    finalizar o pedido.
                  </S.EmptyDescription>
                  <Button
                    variant="primary"
                    onClick={() => setShowAddForm(true)}
                    data-testid="add-address-button"
                  >
                    <Plus size={16} />
                    Adicionar Endereço
                  </Button>
                </S.EmptyState>
              ) : (
                <>
                  <S.AddressListHeader>
                    <S.AddressListTitle>Seus Endereços</S.AddressListTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddForm(true)}
                      data-testid="add-address-button"
                    >
                      <Plus size={16} />
                      Adicionar Novo
                    </Button>
                  </S.AddressListHeader>
                  <S.AddressList>
                    {addresses.map((address) => (
                      <AddressCard
                        key={address.id}
                        address={address}
                        isSelected={selectedAddressId === address.id}
                        onClick={() => setSelectedAddressId(address.id)}
                      />
                    ))}
                  </S.AddressList>
                </>
              )}
            </>
          )}
        </S.AddressesSection>

        {!showAddForm && (
          <S.Footer>
            <Button
              variant="outline"
              onClick={handleClose}
              data-testid="address-cancel-button"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!selectedAddressId || addresses.length === 0}
              data-testid="address-confirm-button"
            >
              Confirmar Endereço
            </Button>
          </S.Footer>
        )}
      </S.ModalContent>
    </Modal>
  )
}
