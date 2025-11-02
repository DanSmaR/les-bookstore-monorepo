import { User } from 'phosphor-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components'
import type { CustomerDTO } from '@/dtos/user/customer.dto'

import * as S from './styles'

interface CustomerPersonalInfoProps {
  customer: CustomerDTO
}

export const CustomerPersonalInfo = ({
  customer,
}: CustomerPersonalInfoProps) => {
  const formatGender = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Masculino'
      case 'female':
        return 'Feminino'
      case 'other':
        return 'Outro'
      default:
        return 'Não informado'
    }
  }

  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <User size={24} />
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <S.InfoGrid>
          <S.InfoItem>
            <S.InfoLabel>Nome Completo</S.InfoLabel>
            <S.InfoValue>{customer.name}</S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>CPF</S.InfoLabel>
            <S.InfoValue>{formatCpf(customer.cpf)}</S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>Data de Nascimento</S.InfoLabel>
            <S.InfoValue>
              {new Date(customer.birthDate).toLocaleDateString('pt-BR')}
            </S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>Gênero</S.InfoLabel>
            <S.InfoValue>{formatGender(customer.gender)}</S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>Data de Cadastro</S.InfoLabel>
            <S.InfoValue>
              {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
            </S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>Última Atualização</S.InfoLabel>
            <S.InfoValue>
              {new Date(customer.updatedAt).toLocaleDateString('pt-BR')}
            </S.InfoValue>
          </S.InfoItem>
        </S.InfoGrid>
      </CardContent>
    </Card>
  )
}
