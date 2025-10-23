import styled from 'styled-components'

export const SummaryContainer = styled.div`
  background: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  padding: ${({ theme }) => theme.SPACING.XL};
  width: 100%;
  max-width: 400px;
  position: sticky;
  top: ${({ theme }) => theme.SPACING.XL};

  @media (max-width: 768px) {
    position: static;
    max-width: none;
    margin-top: ${({ theme }) => theme.SPACING.XL};
  }
`

export const SummaryTitle = styled.h3`
  font-size: ${({ theme }) => theme.FONT_SIZE.LARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_800};
  margin-bottom: ${({ theme }) => theme.SPACING.XL};
  border-bottom: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  padding-bottom: ${({ theme }) => theme.SPACING.MD};
`

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.SPACING.MD};
`

export const SummaryLabel = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
`

export const SummaryValue = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_800};
`

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.SPACING.LG};
  padding-top: ${({ theme }) => theme.SPACING.LG};
  border-top: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  margin-bottom: ${({ theme }) => theme.SPACING.XL};
`

export const TotalLabel = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.MEDIUM};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_800};
`

export const TotalValue = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.LARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
`

export const CheckoutButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.MD};
  padding: ${({ theme }) => `${theme.SPACING.LG} ${theme.SPACING.XL}`};
  font-size: ${({ theme }) => theme.FONT_SIZE.MEDIUM};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  cursor: pointer;
  transition: ${({ theme }) => theme.TRANSITIONS.NORMAL};
  margin-bottom: ${({ theme }) => theme.SPACING.MD};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${({ theme }) => theme.COLORS.NEUTRAL_300};
    cursor: not-allowed;
    transform: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

export const ContinueShoppingButton = styled.button`
  width: 100%;
  background: transparent;
  color: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
  border: 1px solid ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.MD};
  padding: ${({ theme }) => `${theme.SPACING.MD} ${theme.SPACING.XL}`};
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  cursor: pointer;
  transition: ${({ theme }) => theme.TRANSITIONS.NORMAL};
  margin-bottom: ${({ theme }) => theme.SPACING.MD};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.SPACING.SM};

  &:hover {
    background: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
    color: white;
  }
`

export const SecureCheckoutInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.SPACING.SM};
  font-size: ${({ theme }) => theme.FONT_SIZE.XSMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_500};
  text-align: center;
`
