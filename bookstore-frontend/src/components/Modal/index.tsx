import { X } from 'phosphor-react'
import type { MouseEvent, ReactNode } from 'react'

import * as S from './styles'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  'data-testid'?: string
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  'data-testid': dataTestId,
}: ModalProps) => {
  if (!isOpen) return null

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer
        className={className}
        onClick={(e: MouseEvent) => e.stopPropagation()}
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
