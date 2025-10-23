import styled, { css } from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.XL};
  min-width: 320px;
  max-width: 480px;
`

export const IconContainer = styled.div<{
  variant: 'danger' | 'warning' | 'info'
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0 auto;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'danger':
        return css`
          background-color: ${theme.COLORS.ERROR_LIGHTER};
        `
      case 'warning':
        return css`
          background-color: ${theme.COLORS.WARNING_LIGHTER};
        `
      case 'info':
        return css`
          background-color: ${theme.COLORS.SECONDARY_LIGHTER};
        `
      default:
        return css`
          background-color: ${theme.COLORS.ERROR_LIGHTER};
        `
    }
  }}
`

export const Content = styled.div`
  text-align: center;
  margin: ${({ theme }) => theme.SPACING.MD} 0;
`

export const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 ${({ theme }) => theme.SPACING.SM} 0;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
`

export const Message = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  margin: 0;
  line-height: 1.5;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.SPACING.MD};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.SPACING.LG};

  button {
    flex: 1;
  }

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`
