import styled from 'styled-components'

export const RefundSummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.SM};
  padding: ${({ theme }) => theme.SPACING.MD};
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.COLORS.WARNING_LIGHT};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.MD};
`

export const RefundSummaryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.SPACING.SM};
  padding-bottom: ${({ theme }) => theme.SPACING.SM};
  border-bottom: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
`

export const RefundSummaryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.SM};
  font-size: ${({ theme }) => theme.FONT_SIZE.MEDIUM};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.WARNING_DARK};

  svg {
    color: ${({ theme }) => theme.COLORS.WARNING_MAIN};
  }
`

export const RefundAmount = styled.div`
  font-size: ${({ theme }) => theme.FONT_SIZE.LARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.WARNING_DARK};
  background: ${({ theme }) => theme.COLORS.WARNING_LIGHTER};
  padding: ${({ theme }) => theme.SPACING.XS} ${({ theme }) => theme.SPACING.MD};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
`

export const RefundDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.SM};
  max-height: 200px;
  overflow-y: auto;
`

export const RefundItemDate = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.XXSMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_500};
`

export const RefundItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.SPACING.SM};
  padding: ${({ theme }) => theme.SPACING.SM};
  background: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
`

export const RefundItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.SM};
  flex: 1;
`

export const RefundItemId = styled.span`
  font-family: 'Courier New', monospace;
  font-size: ${({ theme }) => theme.FONT_SIZE.XSMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  background: ${({ theme }) => theme.COLORS.NEUTRAL_100};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
`

export const RefundItemAmount = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.WARNING_DARK};
`

export const RefundStatus = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.XS};
  padding: ${({ theme }) => theme.SPACING.XS} ${({ theme }) => theme.SPACING.SM};
  font-size: ${({ theme }) => theme.FONT_SIZE.XSMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({ status, theme }) => {
    switch (status) {
      case 'requested':
        return `
          color: ${theme.COLORS.WARNING_DARK};
          background: ${theme.COLORS.WARNING_LIGHTER};
        `
      case 'approved':
        return `
          color: ${theme.COLORS.SUCCESS_DARK};
          background: ${theme.COLORS.SUCCESS_LIGHTER};
        `
      case 'in_transit':
        return `
          color: ${theme.COLORS.PRIMARY_DARK};
          background: ${theme.COLORS.PRIMARY_LIGHTER};
        `
      case 'completed':
        return `
          color: ${theme.COLORS.SUCCESS_DARK};
          background: ${theme.COLORS.SUCCESS_LIGHTER};
        `
      case 'rejected':
        return `
          color: ${theme.COLORS.ERROR_DARK};
          background: ${theme.COLORS.ERROR_LIGHTER};
        `
      default:
        return `
          color: ${theme.COLORS.NEUTRAL_600};
          background: ${theme.COLORS.NEUTRAL_100};
        `
    }
  }}
`

export const PendingRefundsNotice = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.SM};
  padding: ${({ theme }) => theme.SPACING.SM};
  background: ${({ theme }) => theme.COLORS.WARNING_LIGHTER};
  border: 1px solid ${({ theme }) => theme.COLORS.WARNING_LIGHT};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  color: ${({ theme }) => theme.COLORS.WARNING_DARK};
`

export const FullyRefundedNotice = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.SM};
  padding: ${({ theme }) => theme.SPACING.SM};
  background: ${({ theme }) => theme.COLORS.SUCCESS_LIGHTER};
  border: 1px solid ${({ theme }) => theme.COLORS.SUCCESS_LIGHT};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  color: ${({ theme }) => theme.COLORS.SUCCESS_DARK};
`
