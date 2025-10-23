import React from 'react'

import * as S from './styles'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  ...rest
}) => {
  return (
    <S.StyledBadge variant={variant} size={size} {...rest}>
      {children}
    </S.StyledBadge>
  )
}
