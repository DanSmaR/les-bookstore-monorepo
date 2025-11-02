import styled from 'styled-components'

import { defaultTheme } from '@/styles'

export const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.XL};
  padding: ${defaultTheme.SPACING.SM} 0;
`

export const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.LG};
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

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${defaultTheme.SPACING.LG};
  padding: ${defaultTheme.SPACING.XXXL};
  text-align: center;
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

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.LG};
  align-items: center;
  padding-top: ${defaultTheme.SPACING.XL};
  border-top: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`

export const PaginationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.SM};
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: ${defaultTheme.SPACING.LG};
  }

  span {
    font-size: ${defaultTheme.FONT_SIZE.SMALL};
    color: ${defaultTheme.COLORS.NEUTRAL_600};
  }
`

export const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.SM};

  label {
    font-size: ${defaultTheme.FONT_SIZE.SMALL};
    color: ${defaultTheme.COLORS.NEUTRAL_700};
  }

  select {
    padding: ${defaultTheme.SPACING.XS} ${defaultTheme.SPACING.SM};
    border: 1px solid ${defaultTheme.COLORS.NEUTRAL_300};
    border-radius: ${defaultTheme.BORDER_RADIUS.SM};
    background: ${defaultTheme.COLORS.NEUTRAL_50};
    font-size: ${defaultTheme.FONT_SIZE.SMALL};
    color: ${defaultTheme.COLORS.NEUTRAL_700};
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: ${defaultTheme.COLORS.PRIMARY_MAIN};
    }
  }
`

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.MD};
`

export const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.XS};
`

export const PageButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${defaultTheme.COLORS.NEUTRAL_300};
  border-radius: ${defaultTheme.BORDER_RADIUS.SM};
  background: ${({ active }) =>
    active ? defaultTheme.COLORS.PRIMARY_MAIN : defaultTheme.COLORS.NEUTRAL_50};
  color: ${({ active }) =>
    active ? defaultTheme.COLORS.NEUTRAL_50 : defaultTheme.COLORS.NEUTRAL_700};
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  cursor: pointer;
  transition: ${defaultTheme.TRANSITIONS.FAST};

  &:hover:not(:disabled) {
    background: ${({ active }) =>
      active
        ? defaultTheme.COLORS.PRIMARY_DARK
        : defaultTheme.COLORS.NEUTRAL_100};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const Ellipsis = styled.span`
  padding: 0 ${defaultTheme.SPACING.XS};
  color: ${defaultTheme.COLORS.NEUTRAL_500};
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
`
