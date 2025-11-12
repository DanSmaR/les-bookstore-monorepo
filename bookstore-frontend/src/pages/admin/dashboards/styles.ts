import styled from 'styled-components'

export const Container = styled.div`
  padding: ${({ theme }) => theme.SPACING.XL};
  max-width: ${({ theme }) => theme.BREAKPOINTS.DESKTOP};
  margin: 0 auto;
`

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.SPACING.XL};
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.FONT_SIZE.XXLARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  margin: 0 0 ${({ theme }) => theme.SPACING.SM} 0;
`

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.MEDIUM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  margin: 0;
`

export const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: ${({ theme }) => theme.SPACING.LG};
  margin-bottom: ${({ theme }) => theme.SPACING.XL};
  padding: ${({ theme }) => theme.SPACING.LG};
  background: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};

  @media (max-width: ${({ theme }) => theme.BREAKPOINTS.MOBILE}) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const FiltersGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.SPACING.LG};
  align-items: end;

  @media (max-width: ${({ theme }) => theme.BREAKPOINTS.MOBILE}) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.SPACING.MD};
  background: ${({ theme }) => theme.COLORS.ERROR_LIGHTER};
  border: 1px solid ${({ theme }) => theme.COLORS.ERROR_LIGHT};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.MD};
  color: ${({ theme }) => theme.COLORS.ERROR_DARK};
  margin-bottom: ${({ theme }) => theme.SPACING.XL};
`

export const ChartSection = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  padding: ${({ theme }) => theme.SPACING.XL};
  box-shadow: ${({ theme }) => theme.SHADOWS.SM};
`

export const ChartTitle = styled.h2`
  font-size: ${({ theme }) => theme.FONT_SIZE.LARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  margin: 0 0 ${({ theme }) => theme.SPACING.LG} 0;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.SPACING.XXL};
  background: white;
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  box-shadow: ${({ theme }) => theme.SHADOWS.SM};
`

export const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.MEDIUM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_500};
  text-align: center;
  margin: 0;
`
