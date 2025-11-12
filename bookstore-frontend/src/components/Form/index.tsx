import type { ReactNode } from 'react'
import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'

import * as S from './styles'

interface FormProps<T extends FieldValues> {
  children: ReactNode
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
  className?: string
  noPadding?: boolean
  'data-testid'?: string
}

export const Form = <T extends FieldValues>({
  children,
  form,
  onSubmit,
  className,
  noPadding = false,
  'data-testid': dataTestId,
}: FormProps<T>) => {
  const { handleSubmit } = form

  return (
    <S.FormContainer
      className={className}
      onSubmit={handleSubmit(onSubmit)}
      $noPadding={noPadding}
      data-testid={dataTestId}
    >
      {children}
    </S.FormContainer>
  )
}

// Export sub-components
export { FormField, FormSection } from './components'
