import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.MD};
`

export const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.SM};
  max-height: 400px;
  overflow-y: auto;
  padding-right: ${(props) => props.theme.SPACING.XS};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.COLORS.NEUTRAL_100};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.COLORS.NEUTRAL_300};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.COLORS.NEUTRAL_400};
  }
`

export const OrderItem = styled.div`
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  padding: ${(props) => props.theme.SPACING.MD};
  background: ${(props) => props.theme.COLORS.NEUTRAL_50};
  transition: all ${(props) => props.theme.TRANSITIONS.FAST};

  &:hover {
    border-color: ${(props) => props.theme.COLORS.NEUTRAL_300};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.SPACING.XS};
`

export const OrderId = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_700};
`

export const OrderDate = styled.div`
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  margin-bottom: ${(props) => props.theme.SPACING.SM};
`

export const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.XS};
`

export const ItemsCount = styled.div`
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
`

export const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const Subtotal = styled.div`
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
`

export const Discount = styled.div`
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  color: ${(props) => props.theme.COLORS.SUCCESS_MAIN};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
`

interface TotalProps {
  hasDiscount?: boolean
}

export const Total = styled.div<TotalProps>`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) =>
    props.hasDiscount
      ? props.theme.COLORS.SUCCESS_MAIN
      : props.theme.COLORS.NEUTRAL_700};
  margin-top: 2px;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.SPACING.XXL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  text-align: center;

  svg {
    margin-bottom: ${(props) => props.theme.SPACING.MD};
    opacity: 0.5;
  }

  p {
    font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
    margin: 0;
  }
`

export const ShowAllButton = styled.div`
  padding-top: ${(props) => props.theme.SPACING.SM};
  border-top: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
`
