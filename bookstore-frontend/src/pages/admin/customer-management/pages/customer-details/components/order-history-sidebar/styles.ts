import styled from 'styled-components'

export const StatsSection = styled.div`
  margin-bottom: ${(props) => props.theme.SPACING.LG};
`

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${(props) => props.theme.SPACING.MD};
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.XS};
`

export const StatLabel = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const StatValue = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
`

export const OrderHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.MD};
`

export const SectionTitle = styled.h4`
  margin: 0;
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
`

export const OrderCard = styled.div`
  padding: ${(props) => props.theme.SPACING.MD};
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_50};
  transition: all ${(props) => props.theme.TRANSITIONS.FAST};

  &:hover {
    border-color: ${(props) => props.theme.COLORS.PRIMARY_LIGHT};
    box-shadow: 0 2px 4px ${(props) => props.theme.COLORS.NEUTRAL_200}40;
  }
`

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.SPACING.SM};
`

export const OrderNumber = styled.h6`
  margin: 0;
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
`

export const OrderDate = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
`

export const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.XS};
`

export const OrderValue = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
`

export const OrderStatus = styled.span<{ status: string }>`
  padding: ${(props) => props.theme.SPACING.XS}
    ${(props) => props.theme.SPACING.SM};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;

  ${(props) => {
    switch (props.status) {
      case 'Entregue':
        return `
          background-color: ${props.theme.COLORS.SUCCESS_LIGHTER};
          color: ${props.theme.COLORS.SUCCESS_DARK};
        `
      case 'Em Trânsito':
        return `
          background-color: ${props.theme.COLORS.WARNING_LIGHTER};
          color: ${props.theme.COLORS.WARNING_DARK};
        `
      case 'Preparando':
        return `
          background-color: ${props.theme.COLORS.SECONDARY_LIGHTER};
          color: ${props.theme.COLORS.SECONDARY_DARK};
        `
      case 'Cancelado':
        return `
          background-color: ${props.theme.COLORS.ERROR_LIGHTER};
          color: ${props.theme.COLORS.ERROR_DARK};
        `
      default:
        return `
          background-color: ${props.theme.COLORS.NEUTRAL_200};
          color: ${props.theme.COLORS.NEUTRAL_700};
        `
    }
  }}
`

export const ItemCount = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
`

export const OrderItemsDetails = styled.div`
  margin-top: ${(props) => props.theme.SPACING.SM};
  padding-top: ${(props) => props.theme.SPACING.SM};
  border-top: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
`

export const OrderItemText = styled.div`
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  margin-bottom: ${(props) => props.theme.SPACING.XS};

  &:last-child {
    margin-bottom: 0;
  }
`

export const EmptyOrders = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.SPACING.XL};
  text-align: center;
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};

  p {
    margin: 0;
    font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  }
`
