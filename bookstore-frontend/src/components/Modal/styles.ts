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

export const ModalContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.XL};
  box-shadow: ${({ theme }) => theme.SHADOWS.LG};
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: ${({ theme }) => theme.SPACING.XXL};
`

export const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.SPACING.LG};
  right: ${({ theme }) => theme.SPACING.LG};
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
