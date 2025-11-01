import { MapPin } from 'phosphor-react'

import type { AddressDTO } from '@/dtos'

import * as S from './styles'

interface AddressCardProps {
  address: AddressDTO
  isSelected: boolean
  onClick: () => void
}

export const AddressCard = ({
  address,
  isSelected,
  onClick,
}: AddressCardProps) => {
  const formatAddress = () => {
    const parts = [
      `${address.street}, ${address.number}`,
      address.complement,
      address.district,
      `${address.city} - ${address.state}`,
      address.postalCode,
    ].filter(Boolean)

    return parts.join(', ')
  }

  return (
    <S.AddressCardContainer isSelected={isSelected} onClick={onClick}>
      <S.AddressHeader>
        <S.AddressIcon>
          <MapPin size={20} weight={isSelected ? 'fill' : 'regular'} />
        </S.AddressIcon>
        <S.AddressName>{address.addressName}</S.AddressName>
        <S.RadioButton isSelected={isSelected} />
      </S.AddressHeader>

      <S.AddressDetails>
        <S.AddressText>{formatAddress()}</S.AddressText>
        {address.purpose && (
          <S.AddressPurpose>{address.purpose}</S.AddressPurpose>
        )}
      </S.AddressDetails>
    </S.AddressCardContainer>
  )
}
