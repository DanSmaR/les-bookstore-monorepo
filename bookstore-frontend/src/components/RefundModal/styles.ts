import styled from 'styled-components'

export const RefundFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.MD};
`

export const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.FONT_SIZE.LARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_800};
  margin: 0 0 ${({ theme }) => theme.SPACING.MD} 0;
`

export const FormDescription = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
`

export const NoItemsMessage = styled.div`
  padding: ${({ theme }) => theme.SPACING.XL};
  text-align: center;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
`

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.SM};
  max-height: 300px;
  overflow-y: auto;
`

export const RefundItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.SPACING.SM};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.MD};
  gap: ${({ theme }) => theme.SPACING.MD};
`

export const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.SPACING.XS};
`

export const BookTitle = styled.span`
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_800};
`

export const BookQuantity = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
`

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.XS};
  min-width: 120px;
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.SPACING.SM};
  margin-top: ${({ theme }) => theme.SPACING.MD};
`

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`

export const ItemTitle = styled.span`
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_800};
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
`

export const ItemMaxQuantity = styled.span`
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  font-size: ${({ theme }) => theme.FONT_SIZE.XXSMALL};
`

export const ReasonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.SM};
`

export const ReasonLabel = styled.label`
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_800};
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
`

export const CharacterCount = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  text-align: right;
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.SPACING.MD};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.SPACING.MD};
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.MD};
  padding: ${({ theme }) => theme.SPACING.XL};
  text-align: center;
  background: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border: 1px dashed ${({ theme }) => theme.COLORS.NEUTRAL_300};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
`
