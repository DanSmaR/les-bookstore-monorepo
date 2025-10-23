import styled from 'styled-components'

import { defaultTheme } from '@/styles'

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  max-height: 80vh;
  width: 100%;
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
