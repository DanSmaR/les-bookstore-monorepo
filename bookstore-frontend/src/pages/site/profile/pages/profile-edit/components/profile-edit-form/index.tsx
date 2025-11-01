import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, Form, FormField, FormSection } from '@/components'
import {
  type ProfileEditFormData,
  profileEditSchema,
} from '@/schemas/profile-schemas'
import { genderOptions } from '@/utils/constants'
import {
  convertFromMaskedFormat,
  convertToMaskedFormat,
} from '@/utils/input-masks'

import type { Customer } from '../../types'
import * as S from './styles'

interface ProfileEditFormProps {
  customer: Customer
  onSave: (data: Partial<Customer>) => void
  onCancel?: () => void
  loading?: boolean
  editMode?: boolean
}

export const ProfileEditForm = ({
  customer,
  onSave,
  onCancel: _onCancel,
  loading = false,
  editMode = true,
}: ProfileEditFormProps) => {
  const form = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    mode: 'onChange',
    defaultValues: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone ? convertToMaskedFormat.phone(customer.phone) : '',
      cpf: customer.cpf ? convertToMaskedFormat.cpf(customer.cpf) : '',
      birthDate: customer.birthDate
        ? convertToMaskedFormat.date(customer.birthDate)
        : '',
      gender: customer.gender || '',
    },
  })

  const onSubmit = (data: ProfileEditFormData) => {
    // Convert masked data back to backend format, preserving customer ID
    const convertedData = {
      id: customer.id,
      ...data,
      phone: convertFromMaskedFormat.phone(data.phone),
      cpf: convertFromMaskedFormat.cpf(data.cpf),
      birthDate: convertFromMaskedFormat.date(data.birthDate),
    } as Partial<Customer>
    onSave(convertedData)
  }

  return (
    <S.Container>
      <S.FormTitle>Informações Pessoais</S.FormTitle>

      <Form form={form} onSubmit={onSubmit}>
        <FormSection>
          <S.FormGrid>
            <FormField
              form={form}
              name="name"
              type="text"
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              disabled={!editMode}
              data-testid="profile-name-input"
            />

            <FormField
              form={form}
              name="email"
              type="email"
              label="Email"
              placeholder="Digite seu email"
              disabled={!editMode}
              data-testid="profile-email-input"
            />

            <FormField
              form={form}
              name="cpf"
              type="cpf"
              label="CPF"
              placeholder="000.000.000-00"
              disabled={!editMode}
              data-testid="profile-cpf-input"
            />

            <FormField
              form={form}
              name="birthDate"
              type="date"
              label="Data de Nascimento"
              placeholder="DD/MM/AAAA"
              disabled={!editMode}
              data-testid="profile-birth-date-input"
            />

            <FormField
              form={form}
              name="phone"
              type="phone"
              label="Telefone"
              placeholder="(11) 99999-9999"
              disabled={!editMode}
              data-testid="profile-phone-input"
            />

            <FormField
              form={form}
              name="gender"
              type="select"
              label="Gênero"
              placeholder="Selecione seu gênero"
              options={genderOptions}
              disabled={!editMode}
              data-testid="profile-gender-select"
            />
          </S.FormGrid>
        </FormSection>

        {editMode && (
          <S.FormActions>
            <Button type="submit" loading={loading}>
              Salvar Alterações
            </Button>
          </S.FormActions>
        )}
      </Form>
    </S.Container>
  )
}
