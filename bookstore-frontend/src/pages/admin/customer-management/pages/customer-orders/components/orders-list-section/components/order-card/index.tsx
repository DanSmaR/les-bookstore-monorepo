import { Calendar, DotsThreeOutline, Package } from 'phosphor-react'
import { useState } from 'react'

import {
  ADMIN_REFUND_STATUS_CHANGES,
  ADMIN_STATUS_CHANGES,
  Badge,
  DropdownMenu,
  OrderStatusChanger,
  RefundModal,
  RefundStatusChanger,
  RefundSummary,
} from '@/components'
import type {
  OrderDTO,
  OrderStatusType,
  RefundRequestDTO,
  RefundStatusType,
} from '@/dtos'

import * as S from './styles'

interface OrderCardProps {
  order: OrderDTO
  customerId: string
  formatCurrency: (value: number) => string
  formatDate: (date: Date | string) => string
  onOrderUpdate?: () => void
  onRequestRefund?: (
    customerId: string,
    orderId: string,
    refundData: RefundRequestDTO,
  ) => Promise<{ success: boolean }>
  onChangeOrderStatus?: (
    orderId: string,
    newStatus: OrderStatusType,
  ) => Promise<void>
  onChangeRefundStatus?: (
    orderId: string,
    refundId: string,
    newStatus: RefundStatusType,
  ) => Promise<void>
  isOrderStatusLoading?: boolean
  isRefundStatusLoading?: boolean
}

export const OrderCard = ({
  order,
  customerId,
  formatCurrency,
  formatDate,
  onOrderUpdate,
  onRequestRefund,
  onChangeOrderStatus,
  onChangeRefundStatus,
  isOrderStatusLoading = false,
  isRefundStatusLoading = false,
}: OrderCardProps) => {
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatusType,
  ) => {
    if (onChangeOrderStatus) {
      await onChangeOrderStatus(orderId, newStatus)
      onOrderUpdate?.()
    }
  }

  const handleRefundStatusChange = async (
    refundId: string,
    newStatus: RefundStatusType,
  ) => {
    if (onChangeRefundStatus) {
      await onChangeRefundStatus(order.id, refundId, newStatus)
      onOrderUpdate?.()
    }
  }

  const handleRefundClick = () => {
    setIsRefundModalOpen(true)
  }

  const handleRefundSubmit = async (refundData: RefundRequestDTO) => {
    if (!onRequestRefund) return

    try {
      const result = await onRequestRefund(customerId, order.id, refundData)
      if (result.success) {
        setIsRefundModalOpen(false)
        onOrderUpdate?.()
      }
    } catch {
      // Error handling is done in the parent component
    }
  }
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendente', variant: 'warning' as const }
      case 'confirmed':
        return { label: 'Confirmado', variant: 'default' as const }
      case 'shipped':
        return { label: 'Enviado', variant: 'secondary' as const }
      case 'delivered':
        return { label: 'Entregue', variant: 'success' as const }
      case 'cancelled':
        return { label: 'Cancelado', variant: 'danger' as const }
      default:
        return { label: status, variant: 'default' as const }
    }
  }

  const statusInfo = getStatusInfo(order.status)
  const canRequestRefund = order.status === 'delivered' && order.canBeRefunded

  return (
    <S.OrderCard data-testid="admin-order-card">
      <S.OrderHeader>
        <S.OrderBasicInfo>
          <S.OrderId data-testid="admin-order-id">#{order.id}</S.OrderId>
          <S.OrderDate>
            <Calendar size={16} />
            {formatDate(order.orderDate)}
          </S.OrderDate>
        </S.OrderBasicInfo>
        <S.OrderHeaderActions>
          <Badge
            variant={statusInfo.variant}
            size="sm"
            data-testid="admin-order-status-badge"
          >
            {statusInfo.label}
          </Badge>
          {canRequestRefund && (
            <DropdownMenu
              trigger={<DotsThreeOutline size={20} />}
              items={[
                {
                  id: 'refund',
                  label: 'Solicitar reembolso para cliente',
                  onClick: handleRefundClick,
                },
              ]}
              align="right"
            />
          )}
        </S.OrderHeaderActions>
      </S.OrderHeader>

      <S.OrderContent>
        <S.OrderSummary>
          <S.SummaryItem>
            <Package size={16} />
            <span>
              {order.totalItems} {order.totalItems === 1 ? 'item' : 'itens'}
            </span>
          </S.SummaryItem>
          <S.OrderTotal>
            {formatCurrency(order.subtotal - order.discount || order.subtotal)}
          </S.OrderTotal>
        </S.OrderSummary>

        <S.OrderItems>
          <S.ItemsTitle>Itens do Pedido:</S.ItemsTitle>
          {order.items.slice(0, 3).map((item, index) => (
            <S.OrderItem key={`${item.book.id}-${index}`}>
              <S.ItemInfo>
                <S.BookTitle>{item.book.title}</S.BookTitle>
                <S.BookAuthor>por {item.book.author}</S.BookAuthor>
              </S.ItemInfo>
              <S.ItemDetails>
                <S.ItemQuantity>Qtd: {item.quantity}</S.ItemQuantity>
                <S.ItemPrice>
                  {formatCurrency(item.unitPrice * item.quantity)}
                </S.ItemPrice>
              </S.ItemDetails>
            </S.OrderItem>
          ))}
          {order.items.length > 3 && (
            <S.MoreItems>+{order.items.length - 3} itens a mais</S.MoreItems>
          )}
        </S.OrderItems>

        {order.discount > 0 && (
          <S.OrderDiscount>
            <S.DiscountLabel>Desconto aplicado:</S.DiscountLabel>
            <S.DiscountValue>-{formatCurrency(order.discount)}</S.DiscountValue>
          </S.OrderDiscount>
        )}

        {/* Show RefundSummary if there are any refunds */}
        {(order.refundsSummary?.refundsCount || 0) > 0 && (
          <RefundSummary
            refundsSummary={order.refundsSummary!}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            compact={false}
          />
        )}

        {/* Show RefundStatusChanger for all refunds that need admin action */}
        {order.refundsSummary?.refunds
          ?.sort(
            (a, b) =>
              new Date(b.requestDate).getTime() -
              new Date(a.requestDate).getTime(),
          )
          .map((refund) => (
            <RefundStatusChanger
              key={`refund-status-${refund.id}`}
              refund={refund}
              availableChanges={ADMIN_REFUND_STATUS_CHANGES}
              onStatusChange={handleRefundStatusChange}
              isLoading={isRefundStatusLoading}
            />
          ))}

        <OrderStatusChanger
          order={order}
          availableChanges={ADMIN_STATUS_CHANGES}
          onStatusChange={handleStatusChange}
          isLoading={isOrderStatusLoading}
        />
      </S.OrderContent>

      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        order={order}
        onSubmit={handleRefundSubmit}
      />
    </S.OrderCard>
  )
}
