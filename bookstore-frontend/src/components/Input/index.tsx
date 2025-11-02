import React from 'react'

import * as S from './styles'

export type InputProps = {
  children?: React.ReactNode
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'date'
  customSize?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outline'
  disabled?: boolean
  error?: boolean
  fullWidth?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  label?: string
  helperText?: string
  errorMessage?: string
  required?: boolean
  'data-testid'?: string
} & React.ComponentProps<'input'>

export const Input = ({
  type = 'text',
  customSize = 'md',
  variant = 'default',
  disabled = false,
  error = false,
  fullWidth = false,
  startIcon,
  endIcon,
  label,
  helperText,
  errorMessage,
  required = false,
  'data-testid': dataTestId,
  ...props
}: InputProps) => {
  return (
    <S.InputContainer fullWidth={fullWidth}>
      {label && (
        <S.InputLabel required={required}>
          {label}
          {required && <S.RequiredAsterisk>*</S.RequiredAsterisk>}
        </S.InputLabel>
      )}

      <S.InputWrapper
        size={customSize}
        variant={variant}
        error={error}
        disabled={disabled}
      >
        {startIcon && <S.InputIcon position="start">{startIcon}</S.InputIcon>}

        <S.StyledInput
          type={type}
          disabled={disabled}
          hasStartIcon={!!startIcon}
          hasEndIcon={!!endIcon}
          data-testid={dataTestId}
          {...props}
        />

        {endIcon && <S.InputIcon position="end">{endIcon}</S.InputIcon>}
      </S.InputWrapper>

      {(helperText || errorMessage) && (
        <S.InputHelperText error={error}>
          {error ? errorMessage : helperText}
        </S.InputHelperText>
      )}
    </S.InputContainer>
  )
}
