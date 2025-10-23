import styled from 'styled-components'

export const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_300};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  overflow: hidden;
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_50};
`

export const QuantityButton = styled.button`
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_100};
  border: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.COLORS.NEUTRAL_700};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.COLORS.NEUTRAL_200};
    color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.COLORS.PRIMARY_MAIN};
    outline-offset: -2px;
  }
`

export const QuantityInput = styled.input`
  border: none;
  background: transparent;
  width: 60px;
  height: 36px;
  text-align: center;
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  outline: none;

  /* Remove number input arrows */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  &:focus {
    background-color: ${(props) => props.theme.COLORS.NEUTRAL_100};
  }
`
