import styled from 'styled-components'

import { defaultTheme } from '@/styles'

export const StatusChangerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.SM};
  padding: ${defaultTheme.SPACING.MD};
  background: ${defaultTheme.COLORS.NEUTRAL_50};
  border: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
  border-radius: ${defaultTheme.BORDER_RADIUS.MD};
`

export const StatusChangerTitle = styled.h4`
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_700};
  margin: 0;
`

export const StatusChangerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${defaultTheme.SPACING.SM};
`
