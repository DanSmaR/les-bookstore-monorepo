import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

export const Modal = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.XL};
  box-shadow: ${({ theme }) => theme.SHADOWS.LG};
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.SPACING.XL} ${({ theme }) => theme.SPACING.XL}
    0;
  border-bottom: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  margin-bottom: ${({ theme }) => theme.SPACING.XL};
`

export const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.SM};
  font-size: ${({ theme }) => theme.FONT_SIZE.LARGE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  margin: 0;
`

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_500};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.MD};
  cursor: pointer;
  transition: ${({ theme }) => theme.TRANSITIONS.NORMAL};

  &:hover {
    background: ${({ theme }) => theme.COLORS.NEUTRAL_100};
    color: ${({ theme }) => theme.COLORS.NEUTRAL_700};
  }
`

export const FormContent = styled.div`
  padding: 0 ${({ theme }) => theme.SPACING.XL};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.XL};
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.SPACING.LG};
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.SPACING.MD};
  padding: ${({ theme }) => theme.SPACING.XL};
  border-top: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  margin-top: ${({ theme }) => theme.SPACING.XL};
`
