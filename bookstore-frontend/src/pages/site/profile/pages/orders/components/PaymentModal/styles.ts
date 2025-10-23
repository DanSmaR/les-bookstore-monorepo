import styled from 'styled-components'

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
`

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Title = styled.h2`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`

export const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
`

export const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const OrderId = styled.span`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  font-size: 14px;
  font-weight: 500;
`

export const OrderTotal = styled.span`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  font-size: 18px;
  font-weight: 600;
`

export const CardsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 200px;
  overflow-y: auto;
`

export const CardOption = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.COLORS.PRIMARY_MAIN : theme.COLORS.NEUTRAL_200};
  border-radius: 8px;
  background: ${({ theme, isSelected }) =>
    isSelected ? theme.COLORS.PRIMARY_LIGHTER : '#FFFFFF'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme, isSelected }) =>
      isSelected ? theme.COLORS.PRIMARY_DARK : theme.COLORS.NEUTRAL_300};
  }
`

export const CardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const CardIcon = styled.div`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
`

export const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const CardNumber = styled.span`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  font-size: 14px;
  font-weight: 500;
`

export const CardBrand = styled.span`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  font-size: 12px;
`

export const CardInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 120px;
`

export const AmountLabel = styled.label`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  font-size: 12px;
  margin-bottom: 4px;
`

export const ValidationMessage = styled.div<{ type: 'error' | 'success' }>`
  color: ${({ theme, type }) =>
    type === 'error' ? theme.COLORS.ERROR_MAIN : theme.COLORS.SUCCESS_MAIN};
  font-size: 12px;
  margin-top: 4px;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  text-align: center;
`

export const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_400};
`

export const EmptyTitle = styled.h4`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`

export const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
`

export const FooterActions = styled.div`
  display: flex;
  gap: 12px;
`

export const TotalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
`

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const TotalLabel = styled.span`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  font-size: 14px;
`

export const TotalValue = styled.span<{ variant?: 'primary' | 'error' }>`
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'error':
        return theme.COLORS.ERROR_MAIN
      case 'primary':
        return theme.COLORS.PRIMARY_MAIN
      default:
        return theme.COLORS.NEUTRAL_900
    }
  }};
  font-size: 14px;
  font-weight: 600;
`
