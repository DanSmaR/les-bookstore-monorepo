import { Ticket } from 'phosphor-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Form, FormField } from '@/components'

import * as S from './styles'

interface TicketFormData {
  ticketCode: string
}

interface TicketInputProps {
  onApplyTicket: (ticketCode: string) => Promise<void>
  appliedTicket?: {
    code: string
    discount: number
  } | null
  isLoading?: boolean
}

export const TicketInput = ({
  onApplyTicket,
  appliedTicket,
  isLoading = false,
}: TicketInputProps) => {
  const [isApplying, setIsApplying] = useState(false)

  const form = useForm<TicketFormData>({
    defaultValues: {
      ticketCode: '',
    },
  })

  const handleApplyTicket = async (data: TicketFormData) => {
    if (!data.ticketCode.trim()) return

    setIsApplying(true)
    try {
      await onApplyTicket(data.ticketCode.trim())
      form.reset()
    } catch {
      // Error handling is done in the parent component
    } finally {
      setIsApplying(false)
    }
  }

  const handleRemoveTicket = () => {
    onApplyTicket('')
  }

  if (appliedTicket) {
    return (
      <S.TicketContainer>
        <S.TicketHeader>
          <S.TicketIcon>
            <Ticket size={20} />
          </S.TicketIcon>
          <S.TicketTitle>Cupom Aplicado</S.TicketTitle>
        </S.TicketHeader>

        <S.AppliedTicketCard>
          <S.TicketInfo>
            <S.TicketCode>{appliedTicket.code}</S.TicketCode>
            <S.TicketDiscount>
              Desconto: R$ {appliedTicket.discount.toFixed(2)}
            </S.TicketDiscount>
          </S.TicketInfo>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveTicket}
            disabled={isLoading}
          >
            Remover
          </Button>
        </S.AppliedTicketCard>
      </S.TicketContainer>
    )
  }

  return (
    <S.TicketContainer>
      <S.TicketHeader>
        <S.TicketIcon>
          <Ticket size={20} />
        </S.TicketIcon>
        <S.TicketTitle>Cupom de Desconto</S.TicketTitle>
      </S.TicketHeader>

      <Form form={form} onSubmit={handleApplyTicket} noPadding>
        <S.TicketForm>
          <S.TicketInputWrapper>
            <FormField
              form={form}
              name="ticketCode"
              type="text"
              placeholder="Digite o código do cupom"
              label=""
              disabled={isApplying || isLoading}
            />
          </S.TicketInputWrapper>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            loading={isApplying}
            disabled={isLoading || !form.watch('ticketCode')?.trim()}
          >
            Aplicar
          </Button>
        </S.TicketForm>
      </Form>
    </S.TicketContainer>
  )
}
