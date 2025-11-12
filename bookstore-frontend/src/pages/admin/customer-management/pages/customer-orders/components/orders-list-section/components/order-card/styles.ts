import styled from 'styled-components'

import { defaultTheme } from '@/styles'

export const OrderCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.LG};
  padding: ${defaultTheme.SPACING.LG};
  background: ${defaultTheme.COLORS.NEUTRAL_50};
  border: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
  border-radius: ${defaultTheme.BORDER_RADIUS.LG};
  transition: ${defaultTheme.TRANSITIONS.FAST};

  &:hover {
    box-shadow: ${defaultTheme.SHADOWS.MD};
  }
`

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${defaultTheme.SPACING.MD};
`

export const OrderHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.SM};
`

export const FullyRefundedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.XS};
  padding: ${defaultTheme.SPACING.XS} ${defaultTheme.SPACING.SM};
  background: linear-gradient(
    135deg,
    ${defaultTheme.COLORS.SUCCESS_LIGHTER} 0%,
    ${defaultTheme.COLORS.SUCCESS_LIGHT} 100%
  );
  color: ${defaultTheme.COLORS.SUCCESS_DARK};
  font-size: ${defaultTheme.FONT_SIZE.XSMALL};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  border-radius: ${defaultTheme.BORDER_RADIUS.SM};
  border: 1px solid ${defaultTheme.COLORS.SUCCESS_LIGHT};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const OrderBasicInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.XS};

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
    gap: ${defaultTheme.SPACING.LG};
  }
`

export const OrderId = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.LARGE};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.NEUTRAL_900};
`

export const OrderDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.XS};
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
`

export const OrderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.LG};
`

export const OrderSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${defaultTheme.SPACING.MD};
`

export const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.XS};
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_700};
`

export const OrderTotal = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.LARGE};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.PRIMARY_MAIN};
`

export const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.MD};
`

export const ItemsTitle = styled.h4`
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_800};
  margin: 0;
`

export const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${defaultTheme.SPACING.MD};
  padding: ${defaultTheme.SPACING.MD};
  background: ${defaultTheme.COLORS.NEUTRAL_100};
  border-radius: ${defaultTheme.BORDER_RADIUS.MD};
`

export const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.XS};
`

export const BookTitle = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_900};
`

export const BookAuthor = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
`

export const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${defaultTheme.SPACING.XS};
`

export const ItemQuantity = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
`

export const ItemPrice = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_900};
`

export const MoreItems = styled.div`
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_500};
  font-style: italic;
  text-align: center;
  padding: ${defaultTheme.SPACING.SM};
`

export const OrderDiscount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${defaultTheme.SPACING.MD};
  background: ${defaultTheme.COLORS.SUCCESS_LIGHTER};
  border: 1px solid ${defaultTheme.COLORS.SUCCESS_LIGHT};
  border-radius: ${defaultTheme.BORDER_RADIUS.MD};
`

export const DiscountLabel = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  color: ${defaultTheme.COLORS.SUCCESS_DARK};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
`

export const DiscountValue = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.SUCCESS_DARK};
`
