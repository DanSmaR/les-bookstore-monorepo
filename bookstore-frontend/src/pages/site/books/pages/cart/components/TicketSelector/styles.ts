import styled from 'styled-components'

export const TicketContainer = styled.div`
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_50};
  padding: ${(props) => props.theme.SPACING.LG};
  margin-bottom: ${(props) => props.theme.SPACING.LG};
  display: flex;
  flex-direction: column;
  min-height: 0;
`

export const TicketHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.SPACING.MD};
`

export const TicketHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};
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

export const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.COLORS.DANGER_MAIN};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  cursor: pointer;
  padding: ${(props) => props.theme.SPACING.XS}
    ${(props) => props.theme.SPACING.SM};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.COLORS.DANGER_LIGHTER};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const TicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.SM};
  max-height: 400px;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: ${(props) => props.theme.SPACING.XS};
  flex-shrink: 0;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.COLORS.NEUTRAL_100};
    border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.COLORS.NEUTRAL_300};
    border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.COLORS.NEUTRAL_400};
  }
`

export const TicketCard = styled.label<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.MD};
  padding: ${(props) => props.theme.SPACING.MD};
  background-color: ${(props) =>
    props.$isSelected
      ? props.theme.COLORS.PRIMARY_LIGHTER
      : props.theme.COLORS.WHITE};
  border: 2px solid
    ${(props) =>
      props.$isSelected
        ? props.theme.COLORS.PRIMARY_MAIN
        : props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  min-height: fit-content;

  &:hover {
    border-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
    background-color: ${(props) =>
      props.$isSelected
        ? props.theme.COLORS.PRIMARY_LIGHTER
        : props.theme.COLORS.PRIMARY_LIGHTEST};
  }

  input[type='checkbox'] {
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
    flex-shrink: 0;
  }
`

export const TicketInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.XS};
`

export const TicketMainInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};
  flex-wrap: wrap;
`

export const TicketCode = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  text-transform: uppercase;
`

export const TicketNatureBadge = styled.span<{
  $nature: 'promotional' | 'exchange'
}>`
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) =>
    props.$nature === 'promotional'
      ? props.theme.COLORS.INFO_DARK
      : props.theme.COLORS.SUCCESS_DARK};
  background-color: ${(props) =>
    props.$nature === 'promotional'
      ? props.theme.COLORS.INFO_LIGHTER
      : props.theme.COLORS.SUCCESS_LIGHTER};
  padding: 2px 8px;
  border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  text-transform: uppercase;
`

export const TicketValue = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
`

export const TicketDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const TicketDescription = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
`

export const TicketExpiration = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
`

export const EmptyState = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.SPACING.XL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
`

export const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${(props) => props.theme.SPACING.MD};
  opacity: 0.5;
`

export const EmptyStateText = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  margin: 0;
`

export const LoadingState = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.SPACING.XL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
`

export const SummarySection = styled.div`
  margin-top: ${(props) => props.theme.SPACING.MD};
  padding-top: ${(props) => props.theme.SPACING.MD};
  border-top: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
`

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.SPACING.SM};
`

export const SummaryLabel = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
`

export const SummaryValue = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) => props.theme.COLORS.SUCCESS_DARK};
`

export const OptimizationHint = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.SPACING.SM};
  margin-top: ${(props) => props.theme.SPACING.MD};
  padding: ${(props) => props.theme.SPACING.SM};
  background-color: ${(props) => props.theme.COLORS.INFO_LIGHTEST};
  border-left: 3px solid ${(props) => props.theme.COLORS.INFO_MAIN};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
`

export const HintIcon = styled.div`
  color: ${(props) => props.theme.COLORS.INFO_MAIN};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const HintText = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.INFO_DARK};
  margin: 0;
  line-height: 1.5;
`
