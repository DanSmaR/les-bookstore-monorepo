import { X } from 'phosphor-react'
import type { MouseEvent, ReactNode } from 'react'

import * as S from './styles'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  maxWidth?: string
  maxHeight?: string
  width?: string
  height?: string
  'data-testid'?: string
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  maxWidth = '480px',
  maxHeight = '90vh',
  width = '100%',
  height = 'auto',
  'data-testid': dataTestId,
}: ModalProps) => {
  if (!isOpen) return null

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer
        className={className}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        width={width}
        height={height}
        data-testid={dataTestId}
      >
        <S.CloseButton onClick={onClose}>
          <X size={20} />
        </S.CloseButton>
        {children}
      </S.ModalContainer>
    </S.Overlay>
  )
}
