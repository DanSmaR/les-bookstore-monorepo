import styled from 'styled-components'

import { defaultTheme } from '@/styles'

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${defaultTheme.SPACING.LG};
  border-bottom: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
`

export const OrderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.SM};
`

export const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.XS};
`

export const OrderDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.XS};
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
`

export const OrderTotal = styled.div`
  font-size: ${defaultTheme.FONT_SIZE.LARGE};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.PRIMARY_MAIN};
`

export const OrderContent = styled.div`
  padding: ${defaultTheme.SPACING.LG};
`

export const OrderFooter = styled.div`
  padding: ${defaultTheme.SPACING.LG};
  border-top: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
  background-color: ${defaultTheme.COLORS.NEUTRAL_50};
  display: flex;
  justify-content: flex-end;
  gap: ${defaultTheme.SPACING.SM};
`

export const OrderSummary = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.LG};
  margin-bottom: ${defaultTheme.SPACING.LG};
  padding-bottom: ${defaultTheme.SPACING.LG};
  border-bottom: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
`

export const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.XS};
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_700};
`

export const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.MD};
`

export const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${defaultTheme.SPACING.LG};
  padding: ${defaultTheme.SPACING.MD};
  background: ${defaultTheme.COLORS.NEUTRAL_50};
  border-radius: ${defaultTheme.BORDER_RADIUS.MD};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${defaultTheme.SPACING.SM};
  }
`

export const BookInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const BookTitle = styled.h4`
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_900};
  margin: 0 0 ${defaultTheme.SPACING.XS} 0;
  line-height: 1.4;
`

export const BookAuthor = styled.p`
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
  margin: 0;
  line-height: 1.4;
`

export const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${defaultTheme.SPACING.XS};

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
`

export const ItemQuantity = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
`

export const ItemPrice = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.PRIMARY_MAIN};
`

export const MoreItems = styled.div`
  padding: ${defaultTheme.SPACING.MD};
  text-align: center;
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
  background: ${defaultTheme.COLORS.NEUTRAL_100};
  border-radius: ${defaultTheme.BORDER_RADIUS.MD};
  border: 1px dashed ${defaultTheme.COLORS.NEUTRAL_300};
`
