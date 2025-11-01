import styled from 'styled-components'

export const TicketContainer = styled.div`
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_50};
  padding: ${(props) => props.theme.SPACING.LG};
  margin-bottom: ${(props) => props.theme.SPACING.LG};
`

export const TicketHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};
  margin-bottom: ${(props) => props.theme.SPACING.MD};
`

export const TicketIcon = styled.div`
  color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const TicketTitle = styled.h3`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  margin: 0;
`

export const TicketForm = styled.div`
  display: flex;
  gap: ${(props) => props.theme.SPACING.SM};
  align-items: flex-end;
`

export const TicketInputWrapper = styled.div`
  flex: 1;
`

export const AppliedTicketCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.SPACING.MD};
  background-color: ${(props) => props.theme.COLORS.SUCCESS_LIGHTER};
  border: 1px solid ${(props) => props.theme.COLORS.SUCCESS_LIGHT};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
`

export const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.XS};
`

export const TicketCode = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) => props.theme.COLORS.SUCCESS_DARK};
  text-transform: uppercase;
`

export const TicketDiscount = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.SUCCESS_DARK};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
`
