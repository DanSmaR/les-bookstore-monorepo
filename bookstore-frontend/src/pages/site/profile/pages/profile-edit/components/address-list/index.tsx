import { House, Warning } from 'phosphor-react'

import { Button } from '@/components'
import { convertToMaskedFormat } from '@/utils'

import type { Address } from '../../types'
import * as S from './styles'

interface AddressListProps {
  addresses: Address[]
  onEdit: (address: Address) => void
  onDelete: (id: string) => void
  loading?: boolean
  editMode?: boolean
}

export const AddressList = ({
  addresses,
  onEdit,
  onDelete,
  loading = false,
  editMode = true,
}: AddressListProps) => {
  const residentialAddresses = addresses.filter((addr) => addr.type === 'house')
  const hasResidential = residentialAddresses.length > 0

  return (
    <S.Container>
      <S.Header>
        <S.Title>Seus Endereços</S.Title>
        {!hasResidential && (
          <S.RequiredMessage>
            <Warning size={16} /> É obrigatório ter pelo menos um endereço
            residencial
          </S.RequiredMessage>
        )}
      </S.Header>

      {addresses.length === 0 ? (
        <S.EmptyState>
          <S.EmptyIcon>
            <House size={48} />
          </S.EmptyIcon>
          <S.EmptyTitle>Nenhum endereço cadastrado</S.EmptyTitle>
          <S.EmptyDescription>
            Adicione seu primeiro endereço para continuar
          </S.EmptyDescription>
        </S.EmptyState>
      ) : (
        <S.AddressList>
          {addresses.map((address) => (
            <S.AddressCard key={address.id} $isMain={false}>
              <S.AddressHeader>
                <S.AddressName>{address.addressName}</S.AddressName>
                <S.AddressType>{address.type}</S.AddressType>
              </S.AddressHeader>

              <S.AddressInfo>
                <S.AddressLine>
                  {address.street}, {address.number}
                  {address.complement && ` - ${address.complement}`}
                </S.AddressLine>
                <S.AddressLine>
                  {address.district} - {address.city}/{address.state}
                </S.AddressLine>
                <S.AddressLine>
                  CEP: {convertToMaskedFormat.zipCode(address.postalCode)}
                </S.AddressLine>
              </S.AddressInfo>

              {editMode && (
                <S.AddressActions>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(address)}
                    data-testid="profile-address-edit-button"
                    disabled={loading}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(address.id)}
                    disabled={
                      loading ||
                      (address.type === 'house' &&
                        residentialAddresses.length === 1)
                    }
                  >
                    Excluir
                  </Button>
                </S.AddressActions>
              )}
            </S.AddressCard>
          ))}
        </S.AddressList>
      )}
    </S.Container>
  )
}
