import styled from 'styled-components'

export const StatusChangerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.SM};
  padding: ${({ theme }) => theme.SPACING.MD};
  background: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.MD};
`

export const StatusChangerTitle = styled.h4`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_700};
  margin: 0;
`

export const StatusChangerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.SPACING.XS};
`
