import styled from 'styled-components'

import { defaultTheme } from '@/styles'

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 700px;
  max-height: 85vh;
  width: 100%;
  overflow: hidden;
`

export const Header = styled.div`
  padding: ${defaultTheme.SPACING.LG};
  border-bottom: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
`

export const Title = styled.h2`
  margin: 0 0 ${defaultTheme.SPACING.SM} 0;
  font-size: ${defaultTheme.FONT_SIZE.LARGE};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.NEUTRAL_900};
`

export const Subtitle = styled.p`
  margin: 0;
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
`

export const AddressesSection = styled.div`
  flex: 1;
  padding: ${defaultTheme.SPACING.LG};
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
`

export const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.MD};
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${defaultTheme.SPACING.XL} ${defaultTheme.SPACING.LG};
  text-align: center;
  gap: ${defaultTheme.SPACING.MD};
`

export const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${defaultTheme.COLORS.NEUTRAL_100};
  color: ${defaultTheme.COLORS.NEUTRAL_400};
  margin-bottom: ${defaultTheme.SPACING.SM};
`

export const EmptyTitle = styled.h3`
  margin: 0;
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_800};
`

export const EmptyDescription = styled.p`
  margin: 0;
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_600};
  max-width: 280px;
  line-height: 1.5;
`

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${defaultTheme.SPACING.SM};
  padding: ${defaultTheme.SPACING.LG};
  border-top: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
  background-color: ${defaultTheme.COLORS.NEUTRAL_50};
`

export const AddressFormContainer = styled.div`
  padding: 0;
  width: 100%;
  overflow: visible;
  min-width: 0;
  
  /* Ensure form inputs can display full placeholder text */
  input, select {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }
`

export const FormTitle = styled.h3`
  margin: 0 0 ${defaultTheme.SPACING.LG} 0;
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  font-weight: ${defaultTheme.FONT_WEIGHT.BOLD};
  color: ${defaultTheme.COLORS.NEUTRAL_900};
  padding: 0;
`

export const FormSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${defaultTheme.SPACING.MD};
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  /* Ensure form fields don't get cropped */
  & > * {
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
  }
`

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${defaultTheme.SPACING.SM};
  margin-top: ${defaultTheme.SPACING.LG};
  padding-top: ${defaultTheme.SPACING.LG};
  border-top: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
`

export const AddressListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${defaultTheme.SPACING.MD};
`

export const AddressListTitle = styled.h3`
  margin: 0;
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_800};
`
