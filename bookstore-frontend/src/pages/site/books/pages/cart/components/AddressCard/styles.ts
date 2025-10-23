import styled from 'styled-components'

import { defaultTheme } from '@/styles'

interface AddressCardContainerProps {
  isSelected: boolean
}

interface RadioButtonProps {
  isSelected: boolean
}

export const AddressCardContainer = styled.div<AddressCardContainerProps>`
  padding: ${defaultTheme.SPACING.MD};
  border: 2px solid
    ${({ isSelected }) =>
      isSelected
        ? defaultTheme.COLORS.PRIMARY_MAIN
        : defaultTheme.COLORS.NEUTRAL_200};
  border-radius: ${defaultTheme.BORDER_RADIUS.MD};
  background-color: ${({ isSelected }) =>
    isSelected
      ? defaultTheme.COLORS.PRIMARY_LIGHTER
      : defaultTheme.COLORS.NEUTRAL_50};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${defaultTheme.COLORS.PRIMARY_MAIN};
    background-color: ${defaultTheme.COLORS.PRIMARY_LIGHTER};
  }
`

export const AddressHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.SM};
  margin-bottom: ${defaultTheme.SPACING.SM};
`

export const AddressIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${defaultTheme.COLORS.PRIMARY_MAIN};
`

export const AddressName = styled.h4`
  flex: 1;
  margin: 0;
  font-size: ${defaultTheme.FONT_SIZE.MEDIUM};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_900};
`

export const RadioButton = styled.div<RadioButtonProps>`
  width: 20px;
  height: 20px;
  border: 2px solid
    ${({ isSelected }) =>
      isSelected
        ? defaultTheme.COLORS.PRIMARY_MAIN
        : defaultTheme.COLORS.NEUTRAL_300};
  border-radius: 50%;
  background-color: ${({ isSelected }) =>
    isSelected ? defaultTheme.COLORS.PRIMARY_MAIN : 'transparent'};
  position: relative;

  ${({ isSelected }) =>
    isSelected &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #FFFFFF;
    }
  `}
`

export const AddressDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.XS};
`

export const AddressText = styled.p`
  margin: 0;
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_700};
  line-height: 1.4;
`

export const AddressPurpose = styled.span`
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.PRIMARY_MAIN};
  text-transform: capitalize;
`
