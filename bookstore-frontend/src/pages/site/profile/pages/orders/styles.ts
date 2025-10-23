import styled from 'styled-components'

import { defaultTheme } from '@/styles'

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.XL};
  width: 100%;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${defaultTheme.SPACING.LG};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const Title = styled.h1`
  font-size: ${defaultTheme.FONT_SIZE.XXLARGE};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.NEUTRAL_900};
  margin: 0;
`

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.LG};
  padding: ${defaultTheme.SPACING.XL};
  background: ${defaultTheme.COLORS.NEUTRAL_50};
  border-radius: ${defaultTheme.BORDER_RADIUS.LG};
  border: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
`

export const FilterRow = styled.div`
  display: flex;
  gap: ${defaultTheme.SPACING.LG};
  align-items: end;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const FilterActions = styled.div`
  display: flex;
  gap: ${defaultTheme.SPACING.MD};
  align-items: center;
`

export const OrdersStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${defaultTheme.SPACING.LG};
  margin-bottom: ${defaultTheme.SPACING.XL};
`

export const StatCard = styled.div`
  background: ${defaultTheme.COLORS.NEUTRAL_50};
  border: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
  border-radius: ${defaultTheme.BORDER_RADIUS.LG};
  padding: ${defaultTheme.SPACING.XL};
  text-align: center;

  h3 {
    font-size: ${defaultTheme.FONT_SIZE.LARGE};
    font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
    color: ${defaultTheme.COLORS.PRIMARY_MAIN};
    margin: 0 0 ${defaultTheme.SPACING.SM} 0;
  }

  p {
    font-size: ${defaultTheme.FONT_SIZE.SMALL};
    color: ${defaultTheme.COLORS.NEUTRAL_600};
    margin: 0;
  }
`

export const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.LG};
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${defaultTheme.SPACING.XXXL} ${defaultTheme.SPACING.XL};
  text-align: center;
  background: ${defaultTheme.COLORS.NEUTRAL_50};
  border: 2px dashed ${defaultTheme.COLORS.NEUTRAL_300};
  border-radius: ${defaultTheme.BORDER_RADIUS.LG};
`

export const EmptyIcon = styled.div`
  margin-bottom: ${defaultTheme.SPACING.LG};
  color: ${defaultTheme.COLORS.NEUTRAL_400};
`

export const EmptyTitle = styled.h3`
  font-size: ${defaultTheme.FONT_SIZE.LARGE};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.NEUTRAL_700};
  margin: 0 0 ${defaultTheme.SPACING.SM} 0;
`

export const EmptyDescription = styled.p`
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_500};
  margin: 0;
  max-width: 400px;
`

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${defaultTheme.SPACING.XXXL};
  font-size: ${defaultTheme.FONT_SIZE.LARGE};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
`

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${defaultTheme.SPACING.XXXL};
  text-align: center;
  background: ${defaultTheme.COLORS.NEUTRAL_50};
  border: 1px solid ${defaultTheme.COLORS.NEUTRAL_300};
  border-radius: ${defaultTheme.BORDER_RADIUS.LG};

  h3 {
    font-size: ${defaultTheme.FONT_SIZE.LARGE};
    font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
    color: ${defaultTheme.COLORS.NEUTRAL_900};
    margin: 0 0 ${defaultTheme.SPACING.MD} 0;
  }

  p {
    font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
    color: ${defaultTheme.COLORS.NEUTRAL_600};
    margin: 0 0 ${defaultTheme.SPACING.XL} 0;
    max-width: 400px;
    line-height: 1.5;
  }
`
