import { Warning } from 'phosphor-react'
import React from 'react'

import { Button } from '../Button'
import { Modal } from '../Modal'
import * as S from './styles'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <Warning size={24} color="#ef4444" />
      case 'warning':
        return <Warning size={24} color="#f59e0b" />
      case 'info':
        return <Warning size={24} color="#3b82f6" />
      default:
        return <Warning size={24} color="#ef4444" />
    }
  }

  const getConfirmButtonVariant = ():
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger' => {
    switch (variant) {
      case 'danger':
        return 'danger'
      case 'warning':
        return 'primary'
      case 'info':
        return 'primary'
      default:
        return 'danger'
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <S.Container>
        <S.IconContainer variant={variant}>{getIcon()}</S.IconContainer>

        <S.Content>
          <S.Title>{title}</S.Title>
          <S.Message>{message}</S.Message>
        </S.Content>

        <S.ButtonGroup>
          <Button variant="ghost" onClick={onClose} type="button">
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
            type="button"
          >
            {confirmText}
          </Button>
        </S.ButtonGroup>
      </S.Container>
    </Modal>
  )
}
