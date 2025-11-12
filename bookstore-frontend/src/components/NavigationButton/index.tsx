import type { ReactNode } from 'react'

import * as S from './styles'

interface NavigationButtonProps {
  to: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  'data-testid'?: string
}

export const NavigationButton = ({
  to,
  children,
  variant = 'primary',
  'data-testid': dataTestId,
}: NavigationButtonProps) => {
  return (
    <S.StyledNavigationButton to={to} variant={variant} data-testid={dataTestId}>
      {children}
    </S.StyledNavigationButton>
  )
}
