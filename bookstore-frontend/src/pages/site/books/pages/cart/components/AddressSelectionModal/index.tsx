import { MapPin } from 'phosphor-react'
import { useState } from 'react'

import { Button, Modal } from '@/components'
import type { AddressDTO } from '@/dtos'

import { AddressCard } from '../AddressCard'
import * as S from './styles'

interface AddressSelectionModalProps {
  isOpen: boolean
  addresses: AddressDTO[]
  onClose: () => void
  onConfirm: (selectedAddressId: string) => void
}

export const AddressSelectionModal = ({
  isOpen,
  addresses,
  onClose,
  onConfirm,
}: AddressSelectionModalProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')

  const handleConfirm = () => {
    if (selectedAddressId) {
      onConfirm(selectedAddressId)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedAddressId('')
    onClose()
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
            </S.EmptyState>
          ) : (
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
          )}
        </S.AddressesSection>

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
      </S.ModalContent>
    </Modal>
  )
}
