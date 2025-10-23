import styled from 'styled-components'

export const EmptyCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  min-height: 400px;
`

export const EmptyCartIcon = styled.div`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_400};
  margin-bottom: 24px;
  opacity: 0.7;
`

export const EmptyCartTitle = styled.h2`
  font-size: ${({ theme }) => theme.FONT_SIZE.XLARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_800};
  margin-bottom: 16px;
`

export const EmptyCartDescription = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.MEDIUM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  line-height: 1.6;
  max-width: 480px;
  margin-bottom: 32px;
`

export const ActionButton = styled.div`
  margin-top: 24px;
`
