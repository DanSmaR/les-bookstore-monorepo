import { House, Lock, PencilSimple, X } from 'phosphor-react'
import React from 'react'

import { Button } from '@/components'
import { Container } from '@/pages/site/layout/styles'

import {
  AddressForm,
  AddressList,
  PasswordForm,
  ProfileEditForm,
} from './components'
import * as S from './styles'
import type { Address, PasswordChangeData } from './types'
import { useProfileEdit } from './use-profile-edit'

export const ProfileEdit = () => {
  const {
    // Estado principal
    customer,
    loading,
    saving,
    hasLoadError,

    // Função para salvar perfil
    saveProfile,

    // Gerenciamento de endereços
    editingAddress,
    startAddingAddress,
    startEditingAddress,
    saveAddress,
    removeAddress,
    cancelAddressEditing,

    // Alteração de senha
    setPasswordFormData,
    changePassword,

    // Funções de carregamento
    loadProfile,
  } = useProfileEdit()

  // Estados de controle de UI
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [showPasswordForm, setShowPasswordForm] = React.useState(false)
  const [showAddressForm, setShowAddressForm] = React.useState(false)

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode)
    // If canceling edit mode, reset any unsaved changes if needed
    if (isEditMode) {
      // Optionally reload profile to reset any unsaved changes
      loadProfile()
    }
  }

  const handleAddAddress = () => {
    startAddingAddress()
    setShowAddressForm(true)
  }

  const handleEditAddress = (address: Address) => {
    startEditingAddress(address)
    setShowAddressForm(true)
  }

  const handleSaveAddress = async (addressData: Omit<Address, 'id'>) => {
    await saveAddress(addressData)
    setShowAddressForm(false)
  }

  const handleDeleteAddress = async (addressId: string) => {
    await removeAddress(addressId)
  }

  const handlePasswordChange = async (passwordData: PasswordChangeData) => {
    // Atualizar os dados de senha no hook
    setPasswordFormData(passwordData)
    await changePassword()
    setShowPasswordForm(false)
  }

  if (loading) {
    return (
      <Container>
        <S.ContentContainer>
          <S.LoadingContainer>
            <S.LoadingText>Carregando perfil...</S.LoadingText>
          </S.LoadingContainer>
        </S.ContentContainer>
      </Container>
    )
  }

  if (hasLoadError || (!customer && !loading)) {
    return (
      <Container>
        <S.ContentContainer>
          <S.ErrorContainer>
            <S.ErrorText>Erro ao carregar perfil</S.ErrorText>
            <Button onClick={loadProfile}>Tentar Novamente</Button>
          </S.ErrorContainer>
        </S.ContentContainer>
      </Container>
    )
  }

  if (!customer) {
    return (
      <Container>
        <S.ContentContainer>
          <S.LoadingContainer>
            <S.LoadingText>Carregando perfil...</S.LoadingText>
          </S.LoadingContainer>
        </S.ContentContainer>
      </Container>
    )
  }

  return (
    <Container>
      <S.ContentContainer>
        <S.Header>
          <div>
            <S.Title>Meu Perfil</S.Title>
            <S.Subtitle>
              {isEditMode
                ? 'Editando suas informações pessoais'
                : 'Visualizando suas informações pessoais'}
            </S.Subtitle>
          </div>
          <Button
            variant={isEditMode ? 'ghost' : 'primary'}
            size="sm"
            onClick={handleEditToggle}
          >
            {isEditMode ? (
              <>
                <X size={16} /> Cancelar Edição
              </>
            ) : (
              <>
                <PencilSimple size={16} /> Editar Perfil
              </>
            )}
          </Button>
        </S.Header>

        {showPasswordForm ? (
          <PasswordForm
            onSave={handlePasswordChange}
            onCancel={() => setShowPasswordForm(false)}
            loading={saving}
            editMode={isEditMode}
          />
        ) : showAddressForm ? (
          <AddressForm
            address={editingAddress || undefined}
            onSave={handleSaveAddress}
            onCancel={() => {
              setShowAddressForm(false)
              cancelAddressEditing()
            }}
            loading={saving}
            editMode={isEditMode}
          />
        ) : (
          <>
            <ProfileEditForm
              customer={customer}
              onSave={saveProfile}
              loading={saving}
              editMode={isEditMode}
            />

            {isEditMode && (
              <S.ActionsContainer>
                <S.ActionButton onClick={() => setShowPasswordForm(true)}>
                  <Lock size={20} /> Alterar Senha
                </S.ActionButton>
                <S.ActionButton onClick={handleAddAddress}>
                  <House size={20} /> Adicionar Endereço
                </S.ActionButton>
              </S.ActionsContainer>
            )}

            <AddressList
              addresses={customer.addresses || []}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              loading={saving}
              editMode={isEditMode}
            />
          </>
        )}
      </S.ContentContainer>
    </Container>
  )
}
