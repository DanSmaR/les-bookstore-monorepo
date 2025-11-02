import styled from 'styled-components'

import { defaultTheme } from '@/styles'

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.XL};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${defaultTheme.SPACING.XL};
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

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.SM};
`

export const Title = styled.h1`
  font-size: ${defaultTheme.FONT_SIZE.XXLARGE};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.NEUTRAL_900};
  margin: 0;
`

export const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.XS};
`

export const CustomerName = styled.h2`
  font-size: ${defaultTheme.FONT_SIZE.LARGE};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_800};
  margin: 0;
`

export const CustomerEmail = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
`

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${defaultTheme.SPACING.LG};
`

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.MD};
  background: ${defaultTheme.COLORS.NEUTRAL_50};
  border: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
  border-radius: ${defaultTheme.BORDER_RADIUS.LG};
  padding: ${defaultTheme.SPACING.LG};
  box-shadow: ${defaultTheme.SHADOWS.SM};
`

export const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${defaultTheme.COLORS.PRIMARY_LIGHTER};
  color: ${defaultTheme.COLORS.PRIMARY_MAIN};
  border-radius: ${defaultTheme.BORDER_RADIUS.MD};
`

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.XS};
`

export const StatValue = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.XLARGE};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.NEUTRAL_900};
`

export const StatLabel = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
  text-transform: uppercase;
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
`

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${defaultTheme.SPACING.XXXL};
  text-align: center;

  p {
    font-size: ${defaultTheme.FONT_SIZE.LARGE};
    color: ${defaultTheme.COLORS.NEUTRAL_600};
    margin: 0;
  }
`

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${defaultTheme.SPACING.LG};
  padding: ${defaultTheme.SPACING.XXXL};
  text-align: center;
  background: ${defaultTheme.COLORS.NEUTRAL_50};
  border-radius: ${defaultTheme.BORDER_RADIUS.LG};
  border: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};

  h3 {
    font-size: ${defaultTheme.FONT_SIZE.XLARGE};
    font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
    color: ${defaultTheme.COLORS.NEUTRAL_900};
    margin: 0;
  }

  p {
    font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
    color: ${defaultTheme.COLORS.NEUTRAL_600};
    margin: 0;
    max-width: 400px;
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${defaultTheme.SPACING.LG};
  padding: ${defaultTheme.SPACING.XXXL};
  text-align: center;
  background: ${defaultTheme.COLORS.NEUTRAL_50};
  border-radius: ${defaultTheme.BORDER_RADIUS.LG};
  border: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
`

export const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: ${defaultTheme.COLORS.NEUTRAL_100};
  color: ${defaultTheme.COLORS.NEUTRAL_400};
  border-radius: ${defaultTheme.BORDER_RADIUS.XXL};
`

export const EmptyTitle = styled.h3`
  font-size: ${defaultTheme.FONT_SIZE.XLARGE};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.NEUTRAL_700};
  margin: 0;
`

export const EmptyDescription = styled.p`
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
  margin: 0;
  max-width: 400px;
`
