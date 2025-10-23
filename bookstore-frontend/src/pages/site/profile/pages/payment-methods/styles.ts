import styled from 'styled-components'

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.XL};
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.SPACING.XXL};
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.FONT_SIZE.XXLARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  margin: 0;
`

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.SM};
  padding: ${({ theme }) => theme.SPACING.MD} ${({ theme }) => theme.SPACING.LG};
  background: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  cursor: pointer;
  transition: ${({ theme }) => theme.TRANSITIONS.NORMAL};

  &:hover {
    background: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.LG};
`

export const CardItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.SPACING.XL};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.XL};
  background: white;
  box-shadow: ${({ theme }) => theme.SHADOWS.MD};
`

export const CardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.MD};
`

export const CardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.COLORS.NEUTRAL_100};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
`

export const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.XS};
`

export const CardNumber = styled.span`
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
`

export const CardType = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  text-transform: capitalize;
`

export const CardExpiry = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.XSMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_500};
`

export const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.SPACING.SM};
`

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.SPACING.SM};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_300};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.MD};
  background: white;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  cursor: pointer;
  transition: ${({ theme }) => theme.TRANSITIONS.NORMAL};

  &:hover {
    background: ${({ theme }) => theme.COLORS.NEUTRAL_50};
    color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  }

  &.danger:hover {
    background: ${({ theme }) => theme.COLORS.ERROR_LIGHTER};
    color: ${({ theme }) => theme.COLORS.ERROR_MAIN};
    border-color: ${({ theme }) => theme.COLORS.ERROR_LIGHT};
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.SPACING.XXXL}
    ${({ theme }) => theme.SPACING.XL};
  text-align: center;
`

export const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.COLORS.NEUTRAL_100};
  border-radius: 50%;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_400};
  margin-bottom: ${({ theme }) => theme.SPACING.LG};
`

export const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.FONT_SIZE.LARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  margin: 0 0 ${({ theme }) => theme.SPACING.SM} 0;
`

export const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  margin: 0 0 ${({ theme }) => theme.SPACING.XL} 0;
  max-width: 320px;
`

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.SPACING.XXXL}
    ${({ theme }) => theme.SPACING.XL};
`
