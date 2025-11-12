import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 400px;
  min-height: 400px;
  position: relative;
  overflow: hidden;
`

export const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_500};
  font-size: ${({ theme }) => theme.FONT_SIZE.MEDIUM};
`

export const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_500};
  font-size: ${({ theme }) => theme.FONT_SIZE.MEDIUM};
  text-align: center;
`

export const TooltipContainer = styled.div`
  background: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.MD};
  padding: ${({ theme }) => theme.SPACING.MD};
  box-shadow: ${({ theme }) => theme.SHADOWS.MD};
`

export const TooltipLabel = styled.p`
  margin: 0 0 ${({ theme }) => theme.SPACING.SM} 0;
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
`

export const TooltipItem = styled.div<{ color: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.MD};
  margin-bottom: ${({ theme }) => theme.SPACING.XS};

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '';
    width: ${({ theme }) => theme.SPACING.MD};
    height: ${({ theme }) => theme.SPACING.MD};
    border-radius: 50%;
    background-color: ${({ color }) => color};
    flex-shrink: 0;
  }

  span:first-of-type {
    color: ${({ theme }) => theme.COLORS.NEUTRAL_700};
    font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  }

  span:last-of-type {
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
    color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  }
`
