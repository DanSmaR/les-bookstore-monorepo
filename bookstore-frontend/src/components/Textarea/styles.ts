import styled, { css } from 'styled-components'

// Container for the entire textarea component
export const TextareaContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.XS};
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
`

// Label for the textarea
export const TextareaLabel = styled.label<{ required?: boolean }>`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_700};
  margin-bottom: ${(props) => props.theme.SPACING.XS};
`

export const RequiredAsterisk = styled.span`
  color: ${(props) => props.theme.COLORS.ERROR_MAIN};
  margin-left: 2px;
`

// Wrapper that contains the textarea
export const TextareaWrapper = styled.div<{
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outline'
  error?: boolean
  disabled?: boolean
}>`
  position: relative;
  display: flex;
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  transition: all ${(props) => props.theme.TRANSITIONS.FAST};
  width: 100%;

  /* Size variants */
  ${(props) => {
    const size = props.size || 'md'
    if (size === 'sm') {
      return css`
        padding: ${props.theme.SPACING.XS} ${props.theme.SPACING.SM};
        font-size: ${props.theme.FONT_SIZE.XSMALL};
      `
    }
    if (size === 'lg') {
      return css`
        padding: ${props.theme.SPACING.MD} ${props.theme.SPACING.LG};
        font-size: ${props.theme.FONT_SIZE.LARGE};
      `
    }
    return css`
      padding: ${props.theme.SPACING.SM} ${props.theme.SPACING.MD};
      font-size: ${props.theme.FONT_SIZE.MEDIUM};
    `
  }}

  /* Style variants */
  ${(props) => {
    const variant = props.variant || 'default'
    if (variant === 'filled') {
      return css`
        background-color: ${props.theme.COLORS.NEUTRAL_100};
        border: 1px solid transparent;
      `
    }
    if (variant === 'outline') {
      return css`
        background-color: transparent;
        border: 2px solid ${props.theme.COLORS.NEUTRAL_300};
      `
    }
    return css`
      background-color: ${props.theme.COLORS.NEUTRAL_50};
      border: 1px solid ${props.theme.COLORS.NEUTRAL_300};
    `
  }}

  /* Error state */
  ${(props) =>
    props.error &&
    css`
      border-color: ${props.theme.COLORS.ERROR_MAIN};
      box-shadow: 0 0 0 2px ${props.theme.COLORS.ERROR_MAIN}20;
    `}

  /* Disabled state */
  ${(props) =>
    props.disabled &&
    css`
      background-color: ${props.theme.COLORS.NEUTRAL_100};
      cursor: not-allowed;
      opacity: 0.6;
    `}

  /* Focus state */
  &:focus-within {
    ${(props) =>
      !props.error &&
      css`
        border-color: ${props.theme.COLORS.PRIMARY_MAIN};
        box-shadow: 0 0 0 2px ${props.theme.COLORS.PRIMARY_MAIN}20;
      `}
  }
`

// The actual textarea element
export const StyledTextarea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  resize: vertical;
  min-height: 100px;

  &::placeholder {
    color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${(props) => props.theme.COLORS.NEUTRAL_500};

    &::placeholder {
      color: ${(props) => props.theme.COLORS.NEUTRAL_400};
    }
  }
`

// Helper text below the textarea
export const TextareaHelperText = styled.span<{ error?: boolean }>`
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  color: ${(props) =>
    props.error
      ? props.theme.COLORS.ERROR_MAIN
      : props.theme.COLORS.NEUTRAL_600};
  margin-top: ${(props) => props.theme.SPACING.XS};
`
