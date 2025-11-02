import { ArrowRight, Check, Truck, X } from 'phosphor-react'
import React, { useState } from 'react'

import type { OrderDTO } from '@/dtos'
import { OrderStatus, type OrderStatusType } from '@/dtos'

import { Button } from '../Button'
import { ConfirmationModal } from '../ConfirmationModal'
import * as S from './styles'

type StatusChangeConfig = {
  currentStatus: OrderStatusType
  nextStatus: OrderStatusType
  label: string
  icon: React.ReactNode
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  requiresConfirmation?: boolean
  confirmationMessage?: string
}

interface OrderStatusChangerProps {
  order: OrderDTO
  availableChanges: StatusChangeConfig[]
  onStatusChange: (orderId: string, newStatus: OrderStatusType) => Promise<void>
  isLoading?: boolean
  disabled?: boolean
}

export const OrderStatusChanger = ({
  order,
  availableChanges,
  onStatusChange,
  isLoading = false,
  disabled = false,
}: OrderStatusChangerProps) => {
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    config: StatusChangeConfig | null
    newStatus: OrderStatusType | null
  }>({
    isOpen: false,
    config: null,
    newStatus: null,
  })

  const applicableChanges = availableChanges.filter(
    (change) => change.currentStatus === order.status,
  )

  const handleStatusChangeClick = (
    newStatus: OrderStatusType,
    config: StatusChangeConfig,
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

  const handleConfirmStatusChange = async (newStatus: OrderStatusType) => {
    await onStatusChange(order.id, newStatus)
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
        <S.StatusChangerTitle>Ações Disponíveis</S.StatusChangerTitle>
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
            confirmationModal.config.nextStatus === OrderStatus.CANCELLED
              ? 'danger'
              : 'warning'
          }
        />
      )}
    </>
  )
}

// Predefined status change configurations
export const ADMIN_STATUS_CHANGES: StatusChangeConfig[] = [
  {
    currentStatus: OrderStatus.PENDING,
    nextStatus: OrderStatus.CONFIRMED,
    label: 'Confirmar Pedido',
    icon: <Check size={16} />,
    variant: 'primary',
    requiresConfirmation: true,
    confirmationMessage: 'Confirma o pedido?',
  },
  {
    currentStatus: OrderStatus.CONFIRMED,
    nextStatus: OrderStatus.SHIPPED,
    label: 'Marcar como Enviado',
    icon: <Truck size={16} />,
    variant: 'primary',
    requiresConfirmation: true,
    confirmationMessage: 'Confirma que o pedido foi enviado?',
  },
  {
    currentStatus: OrderStatus.SHIPPED,
    nextStatus: OrderStatus.DELIVERED,
    label: 'Marcar como Entregue',
    icon: <Check size={16} />,
    variant: 'primary',
    requiresConfirmation: true,
    confirmationMessage: 'Confirma que o pedido foi entregue?',
  },
  {
    currentStatus: OrderStatus.PENDING,
    nextStatus: OrderStatus.CANCELLED,
    label: 'Cancelar Pedido',
    icon: <X size={16} />,
    variant: 'danger',
    requiresConfirmation: true,
    confirmationMessage: 'Tem certeza que deseja cancelar este pedido?',
  },
  {
    currentStatus: OrderStatus.CONFIRMED,
    nextStatus: OrderStatus.CANCELLED,
    label: 'Cancelar Pedido',
    icon: <X size={16} />,
    variant: 'danger',
    requiresConfirmation: true,
    confirmationMessage: 'Tem certeza que deseja cancelar este pedido?',
  },
]

export const USER_STATUS_CHANGES: StatusChangeConfig[] = [
  {
    currentStatus: OrderStatus.SHIPPED,
    nextStatus: OrderStatus.DELIVERED,
    label: 'Confirmar Entrega',
    icon: <Check size={16} />,
    variant: 'primary',
    requiresConfirmation: true,
    confirmationMessage: 'Confirma que você recebeu o pedido?',
  },
]

export type { StatusChangeConfig }
