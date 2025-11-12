import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.SPACING.LG};
  margin-bottom: ${({ theme }) => theme.SPACING.XL};
`

export const LoadingSkeleton = styled.div`
  height: 20px;
  background: ${({ theme }) => theme.COLORS.NEUTRAL_200};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
  animation: ${pulse} 2s ease-in-out infinite;
  margin-bottom: ${({ theme }) => theme.SPACING.SM};

  &:last-child {
    height: 40px;
    margin-bottom: 0;
  }
`

export const StatValue = styled.div`
  font-size: ${({ theme }) => theme.FONT_SIZE.XLARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  margin-bottom: ${({ theme }) => theme.SPACING.SM};
`

export const TrendContainer = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.XS};
  color: ${({ theme, isPositive }) =>
    isPositive ? theme.COLORS.SUCCESS_MAIN : theme.COLORS.ERROR_MAIN};
`

export const TrendText = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
`
