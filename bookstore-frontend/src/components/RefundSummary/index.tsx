import {
  ArrowCounterClockwise,
  CheckCircle,
  Clock,
  XCircle,
} from 'phosphor-react'

import type { RefundsSummaryDTO, RefundStatusType } from '@/dtos'

import * as S from './styles'

interface RefundSummaryProps {
  refundsSummary: RefundsSummaryDTO
  formatCurrency: (value: number) => string
  formatDate: (date: Date) => string
  compact?: boolean
}

const getRefundStatusIcon = (status: RefundStatusType) => {
  switch (status) {
    case 'requested':
      return <Clock size={12} />
    case 'approved':
    case 'completed':
      return <CheckCircle size={12} />
    case 'rejected':
      return <XCircle size={12} />
    case 'in_transit':
      return <ArrowCounterClockwise size={12} />
    default:
      return <Clock size={12} />
  }
}

const getRefundStatusLabel = (status: RefundStatusType) => {
  switch (status) {
    case 'requested':
      return 'Solicitado'
    case 'approved':
      return 'Aprovado'
    case 'in_transit':
      return 'Em Trânsito'
    case 'completed':
      return 'Concluído'
    case 'rejected':
      return 'Rejeitado'
    default:
      return status
  }
}

export const RefundSummary = ({
  refundsSummary,
  formatCurrency,
  formatDate,
  compact = false,
}: RefundSummaryProps) => {
  const { totalRefunded, refundsCount, refunds } = refundsSummary

  if (refundsCount === 0) {
    return null
  }

  // Sort refunds by requestDate (newest first)
  const sortedRefunds = refunds.sort(
    (a, b) =>
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime(),
  )

  // Check if there are any pending refunds
  const hasPendingRefunds = refunds.some(
    (refund) => refund.status === 'requested',
  )

  return (
    <S.RefundSummaryContainer>
      <S.RefundSummaryHeader>
        <S.RefundSummaryTitle>
          <ArrowCounterClockwise size={14} />
          {refundsCount === 1 ? '1 reembolso' : `${refundsCount} reembolsos`}
        </S.RefundSummaryTitle>
        {totalRefunded > 0 && (
          <S.RefundAmount>-{formatCurrency(totalRefunded)}</S.RefundAmount>
        )}
      </S.RefundSummaryHeader>

      {hasPendingRefunds && (
        <S.PendingRefundsNotice>
          <Clock size={12} />
          {refunds.filter((r) => r.status === 'requested').length === 1
            ? '1 reembolso pendente'
            : `${refunds.filter((r) => r.status === 'requested').length} reembolsos pendentes`}
        </S.PendingRefundsNotice>
      )}

      {!compact && (
        <S.RefundDetails>
          {sortedRefunds.slice(0, 3).map((refund) => (
            <S.RefundItem key={refund.id}>
              <S.RefundItemInfo>
                {getRefundStatusIcon(refund.status)}
                <S.RefundItemId>#{refund.id.slice(-6)}</S.RefundItemId>
                <S.RefundStatus status={refund.status}>
                  {getRefundStatusLabel(refund.status)}
                </S.RefundStatus>
                <S.RefundItemDate>
                  {formatDate(new Date(refund.requestDate))}
                </S.RefundItemDate>
              </S.RefundItemInfo>
              <S.RefundItemAmount>
                {formatCurrency(refund.totalAmount)}
              </S.RefundItemAmount>
            </S.RefundItem>
          ))}
        </S.RefundDetails>
      )}
    </S.RefundSummaryContainer>
  )
}
