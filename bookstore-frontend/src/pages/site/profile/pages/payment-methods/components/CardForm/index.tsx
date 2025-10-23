import { CreditCard, X } from 'phosphor-react'
import type { UseFormReturn } from 'react-hook-form'

import { Button, Form, FormField } from '@/components'
import type { CardFormData } from '@/schemas'

import * as S from './styles'

interface CardFormProps {
  isOpen: boolean
  isLoading?: boolean
  form: UseFormReturn<CardFormData>
  onSubmit: (data: CardFormData) => void
  onClose: () => void
}

export const CardForm = ({
  isOpen,
  isLoading = false,
  form,
  onSubmit,
  onClose,
}: CardFormProps) => {
  if (!isOpen) return null

  return (
    <S.Overlay>
      <S.Modal>
        <S.Header>
          <S.Title>
            <CreditCard size={20} />
            Adicionar Cartão
          </S.Title>
          <S.CloseButton onClick={onClose}>
            <X size={20} />
          </S.CloseButton>
        </S.Header>

        <Form<CardFormData> form={form} onSubmit={onSubmit}>
          <S.FormContent>
            <FormField<CardFormData>
              form={form}
              name="number"
              type="creditCard"
              label="Número do cartão"
              placeholder="0000 0000 0000 0000"
            />

            <FormField<CardFormData>
              form={form}
              name="holderName"
              label="Nome do portador"
              placeholder="Nome como está no cartão"
            />

            <S.Row>
              <FormField<CardFormData>
                form={form}
                name="expiryDate"
                type="cardExpiry"
                label="Validade"
                placeholder="MM/AA"
              />

              <FormField<CardFormData>
                form={form}
                name="cvv"
                type="cardCVV"
                label="CVV"
                placeholder="123"
              />
            </S.Row>

            <FormField<CardFormData>
              form={form}
              name="type"
              type="select"
              label="Tipo do cartão"
              options={[
                { value: 'credit', label: 'Crédito' },
                { value: 'debit', label: 'Débito' },
              ]}
            />
          </S.FormContent>

          <S.Actions>
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isLoading}>
              Salvar Cartão
            </Button>
          </S.Actions>
        </Form>
      </S.Modal>
    </S.Overlay>
  )
}
