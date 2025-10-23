import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, Form, FormField, FormSection } from '@/components'
import {
  type AddressFormData,
  addressFormSchema,
} from '@/schemas/profile-schemas'
import {
  addressPurposeOptions,
  residenceTypeOptions,
  stateOptions,
} from '@/utils/constants'
import {
  convertFromMaskedFormat,
  convertToMaskedFormat,
} from '@/utils/input-masks'

import type { Address } from '../../types'
import * as S from './styles'

interface AddressFormProps {
  address?: Address
  onSave: (address: Omit<Address, 'id'>) => void
  onCancel: () => void
  loading?: boolean
}

export const AddressForm = ({
  address,
  onSave,
  onCancel,
  loading = false,
}: AddressFormProps) => {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    mode: 'onChange',
    defaultValues: {
      type: address?.type || '',
      purpose: address?.purpose || '',
      addressName: address?.addressName || '',
      postalCode: address?.postalCode
        ? convertToMaskedFormat.zipCode(address.postalCode)
        : '',
      street: address?.street || '',
      number: address?.number || '',
      complement: address?.complement || '',
      district: address?.district || '',
      city: address?.city || '',
      state: address?.state || '',
    },
  })

  const onSubmit = (data: AddressFormData) => {
    // Convert masked data back to backend format
    const convertedData = {
      ...data,
      postalCode: convertFromMaskedFormat.zipCode(data.postalCode),
    } as Omit<Address, 'id'>
    onSave(convertedData)
  }

  return (
    <S.Container>
      <S.FormTitle>
        {address ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
      </S.FormTitle>

      <Form form={form} onSubmit={onSubmit}>
        <FormSection>
          <S.FormGrid>
            <FormField
              form={form}
              name="addressName"
              type="text"
              label="Nome do Endereço"
              placeholder="Ex: Casa, Trabalho, Apartamento..."
            />

            <FormField
              form={form}
              name="type"
              type="select"
              label="Tipo de Residência"
              placeholder="Selecione o tipo"
              options={residenceTypeOptions}
            />

            <FormField
              form={form}
              name="purpose"
              type="select"
              label="Finalidade"
              placeholder="Selecione a finalidade"
              options={addressPurposeOptions}
            />

            <FormField
              form={form}
              name="postalCode"
              type="zipCode"
              label="CEP"
              placeholder="00000-000"
            />

            <FormField
              form={form}
              name="street"
              type="text"
              label="Rua"
              placeholder="Nome da rua"
            />

            <FormField
              form={form}
              name="number"
              type="text"
              label="Número"
              placeholder="Número da residência"
            />

            <FormField
              form={form}
              name="complement"
              type="text"
              label="Complemento"
              placeholder="Apartamento, bloco, etc. (opcional)"
            />

            <FormField
              form={form}
              name="district"
              type="text"
              label="Bairro"
              placeholder="Nome do bairro"
            />

            <FormField
              form={form}
              name="city"
              type="text"
              label="Cidade"
              placeholder="Nome da cidade"
            />

            <FormField
              form={form}
              name="state"
              type="select"
              label="Estado"
              placeholder="Selecione o estado"
              options={stateOptions}
            />
          </S.FormGrid>
        </FormSection>

        <S.FormActions>
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
            data-testid="address-form-cancel-button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            data-testid="address-form-submit-button"
          >
            {address ? 'Atualizar Endereço' : 'Adicionar Endereço'}
          </Button>
        </S.FormActions>
      </Form>
    </S.Container>
  )
}
