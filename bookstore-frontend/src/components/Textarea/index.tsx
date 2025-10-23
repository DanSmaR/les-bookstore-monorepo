import React from 'react'

import * as S from './styles'

export type TextareaProps = {
  customSize?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outline'
  disabled?: boolean
  error?: boolean
  fullWidth?: boolean
  label?: string
  helperText?: string
  errorMessage?: string
  required?: boolean
  rows?: number
  'data-testid'?: string
} & React.ComponentProps<'textarea'>

export const Textarea = ({
  customSize = 'md',
  variant = 'default',
  disabled = false,
  error = false,
  fullWidth = false,
  label,
  helperText,
  errorMessage,
  required = false,
  rows = 4,
  'data-testid': dataTestId,
  ...props
}: TextareaProps) => {
  return (
    <S.TextareaContainer fullWidth={fullWidth}>
      {label && (
        <S.TextareaLabel required={required}>
          {label}
          {required && <S.RequiredAsterisk>*</S.RequiredAsterisk>}
        </S.TextareaLabel>
      )}

      <S.TextareaWrapper
        size={customSize}
        variant={variant}
        error={error}
        disabled={disabled}
      >
        <S.StyledTextarea
          rows={rows}
          disabled={disabled}
          data-testid={dataTestId}
          {...props}
        />
      </S.TextareaWrapper>

      {(helperText || errorMessage) && (
        <S.TextareaHelperText error={error}>
          {error ? errorMessage : helperText}
        </S.TextareaHelperText>
      )}
    </S.TextareaContainer>
  )
}
