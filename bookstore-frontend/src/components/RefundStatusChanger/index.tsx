import { ArrowRight, Check, Package, X } from 'phosphor-react'
import React, { useState } from 'react'

import type { RefundDTO } from '@/dtos'
import { RefundStatus, type RefundStatusType } from '@/dtos'

import { Button } from '../Button'
import { ConfirmationModal } from '../ConfirmationModal'
import * as S from './styles'

type RefundStatusChangeConfig = {
  currentStatus: RefundStatusType
  nextStatus: RefundStatusType
  label: string
  icon: React.ReactNode
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  requiresConfirmation?: boolean
  confirmationMessage?: string
}

interface RefundStatusChangerProps {
  refund: RefundDTO
  availableChanges: RefundStatusChangeConfig[]
  onStatusChange: (
    refundId: string,
    newStatus: RefundStatusType,
  ) => Promise<void>
  isLoading?: boolean
  disabled?: boolean
}

export const RefundStatusChanger = ({
  refund,
  availableChanges,
  onStatusChange,
  isLoading = false,
  disabled = false,
}: RefundStatusChangerProps) => {
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    config: RefundStatusChangeConfig | null
    newStatus: RefundStatusType | null
  }>({
    isOpen: false,
    config: null,
    newStatus: null,
  })

  const applicableChanges = availableChanges.filter(
    (change) => change.currentStatus === refund.status,
  )

  const handleStatusChangeClick = (
    newStatus: RefundStatusType,
    config: RefundStatusChangeConfig,
  ) => {
    if (config.requiresConfirmation && config.confirmationMessage) {
      setConfirmationModal({
        isOpen: true,
        config,
        newStatus,
      })
    } else {
      handleConfirmStatusChange(newStatus)
    }
  }

  const handleConfirmStatusChange = async (newStatus: RefundStatusType) => {
    await onStatusChange(refund.id, newStatus)
    setConfirmationModal({ isOpen: false, config: null, newStatus: null })
  }

  const handleCloseConfirmation = () => {
    setConfirmationModal({ isOpen: false, config: null, newStatus: null })
  }

  if (applicableChanges.length === 0) {
    return null
  }

  return (
    <>
      <S.StatusChangerContainer>
        <S.StatusChangerTitle>Ações de Reembolso</S.StatusChangerTitle>
        <S.StatusChangerActions>
          {applicableChanges.map((config) => (
            <Button
              key={config.nextStatus}
              variant={config.variant}
              size="sm"
              startIcon={config.icon}
              endIcon={<ArrowRight size={14} />}
              onClick={() => handleStatusChangeClick(config.nextStatus, config)}
              disabled={disabled || isLoading}
              loading={isLoading}
            >
              {config.label}
            </Button>
          ))}
        </S.StatusChangerActions>
      </S.StatusChangerContainer>

      {confirmationModal.config && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={handleCloseConfirmation}
          onConfirm={() =>
            confirmationModal.newStatus &&
            handleConfirmStatusChange(confirmationModal.newStatus)
          }
          title="Confirmar Ação"
          message={confirmationModal.config.confirmationMessage || ''}
          confirmText="Confirmar"
          cancelText="Cancelar"
          variant={
            confirmationModal.config.nextStatus === RefundStatus.REJECTED
              ? 'danger'
              : 'warning'
          }
        />
      )}
    </>
  )
}

// Predefined refund status change configurations for ADMIN
export const ADMIN_REFUND_STATUS_CHANGES: RefundStatusChangeConfig[] = [
  {
    currentStatus: RefundStatus.REQUESTED,
    nextStatus: RefundStatus.APPROVED,
    label: 'Aprovar Reembolso',
    icon: <Check size={16} />,
    variant: 'primary',
    requiresConfirmation: true,
    confirmationMessage: 'Aprovar este reembolso?',
  },
  {
    currentStatus: RefundStatus.REQUESTED,
    nextStatus: RefundStatus.REJECTED,
    label: 'Rejeitar Reembolso',
    icon: <X size={16} />,
    variant: 'danger',
    requiresConfirmation: true,
    confirmationMessage: 'Rejeitar este reembolso?',
  },
  {
    currentStatus: RefundStatus.IN_TRANSIT,
    nextStatus: RefundStatus.COMPLETED,
    label: 'Confirmar Entrega e Finalizar Reembolso',
    icon: <Package size={16} />,
    variant: 'primary',
    requiresConfirmation: true,
    confirmationMessage:
      'Confirma que os livros foram recebidos e o reembolso processado?',
  },
]

// Predefined refund status change configurations for USER
export const USER_REFUND_STATUS_CHANGES: RefundStatusChangeConfig[] = [
  {
    currentStatus: RefundStatus.APPROVED,
    nextStatus: RefundStatus.IN_TRANSIT,
    label: 'Confirmar Retirada dos Livros',
    icon: <Package size={16} />,
    variant: 'primary',
    requiresConfirmation: true,
    confirmationMessage: 'Confirma que você enviou os livros de volta?',
  },
]

export type { RefundStatusChangeConfig }
