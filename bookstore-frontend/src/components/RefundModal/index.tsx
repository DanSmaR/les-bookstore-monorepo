import { useState } from 'react'

import { Button, Input, Modal, Textarea } from '@/components'
import type { OrderDTO } from '@/dtos'
import type {
  RefundDTO,
  RefundItemSummaryDTO,
} from '@/dtos/order/refund-summary.dto'
import { useToast } from '@/providers'

import * as S from './styles'

interface RefundItem {
  bookId: string
  bookTitle: string
  quantity: number
  maxQuantity: number
}

interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  order: OrderDTO
  onSubmit?: (refundData: {
    orderId: string
    reason: string
    items: Array<{ bookId: string; quantity: number }>
  }) => Promise<void>
}

export function RefundModal({
  isOpen,
  onClose,
  order,
  onSubmit,
}: RefundModalProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const getAvailableQuantity = (
    bookId: string,
    originalQuantity: number,
  ): number => {
    if (!order.refundsSummary) return originalQuantity

    // Get all refunds from the unified refunds array
    const allRefunds = order.refundsSummary?.refunds || []

    const totalRefundedQuantity = allRefunds.reduce(
      (total: number, refund: RefundDTO) => {
        const refundItem = refund.items.find(
          (item: RefundItemSummaryDTO) => item.bookId === bookId,
        )
        return total + (refundItem ? refundItem.quantity : 0)
      },
      0,
    )

    return Math.max(0, originalQuantity - totalRefundedQuantity)
  }

  const [refundItems, setRefundItems] = useState<RefundItem[]>(
    () =>
      order.items
        .map((item) => {
          const availableQuantity = getAvailableQuantity(
            item.book.id,
            item.quantity,
          )
          return {
            bookId: item.book.id,
            bookTitle: item.book.title,
            quantity: 0,
            maxQuantity: availableQuantity,
          }
        })
        .filter((item) => item.maxQuantity > 0), // Only show items that can be refunded
  )

  const updateQuantity = (bookId: string, quantity: number) => {
    setRefundItems((items) =>
      items.map((item) =>
        item.bookId === bookId
          ? {
              ...item,
              quantity: Math.max(0, Math.min(quantity, item.maxQuantity)),
            }
          : item,
      ),
    )
  }

  const handleSubmit = async () => {
    const itemsToRefund = refundItems.filter((item) => item.quantity > 0)

    if (itemsToRefund.length === 0) {
      toast.showError('Selecione pelo menos um item para reembolso')
      return
    }

    setLoading(true)
    try {
      await onSubmit?.({
        orderId: order.id,
        reason: reason.trim(),
        items: itemsToRefund.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
      })

      // Success feedback is handled by the CRUD hook
      onClose()
      setReason('')
      setRefundItems((items) => items.map((item) => ({ ...item, quantity: 0 })))
    } catch {
      // Error feedback is handled by the CRUD hook
      // Component just needs to reset loading state
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setReason('')
    setRefundItems((items) => items.map((item) => ({ ...item, quantity: 0 })))
  }

  const hasItemsSelected = refundItems.some((item) => item.quantity > 0)

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="500px" maxHeight="80vh">
      <S.RefundFormContainer>
        <S.FormTitle>Solicitar Reembolso</S.FormTitle>
        <S.FormDescription>
          Selecione os livros e quantidades que deseja solicitar o reembolso do
          pedido.
        </S.FormDescription>

        {refundItems.length === 0 ? (
          <S.NoItemsMessage>
            Não há itens disponíveis para reembolso neste pedido. Todos os itens
            já foram reembolsados ou estão com reembolso pendente.
          </S.NoItemsMessage>
        ) : (
          <>
            <S.ItemsList>
              {refundItems.map((item) => (
                <S.RefundItem key={item.bookId}>
                  <S.ItemInfo>
                    <S.ItemTitle>{item.bookTitle}</S.ItemTitle>
                    <S.ItemMaxQuantity>
                      Máximo: {item.maxQuantity}
                    </S.ItemMaxQuantity>
                  </S.ItemInfo>
                  <S.QuantityControl>
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateQuantity(item.bookId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 0}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity.toString()}
                      onChange={(e) =>
                        updateQuantity(item.bookId, Number(e.target.value))
                      }
                      min={0}
                      max={item.maxQuantity}
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateQuantity(item.bookId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.maxQuantity}
                    >
                      +
                    </Button>
                  </S.QuantityControl>
                </S.RefundItem>
              ))}
            </S.ItemsList>

            <S.ReasonContainer>
              <S.ReasonLabel>Motivo do reembolso</S.ReasonLabel>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Descreva o motivo do seu pedido de reembolso..."
                rows={3}
                maxLength={500}
              />
              <S.CharacterCount>{reason.length}/500</S.CharacterCount>
            </S.ReasonContainer>

            <S.ButtonContainer>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!hasItemsSelected || loading}
                loading={loading}
              >
                Solicitar Reembolso
              </Button>
            </S.ButtonContainer>
          </>
        )}
      </S.RefundFormContainer>
    </Modal>
  )
}
