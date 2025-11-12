import { Package } from 'phosphor-react'

import { Button, Card, CardContent } from '@/components'
import type {
  OrderDTO,
  OrderStatusType,
  RefundRequestDTO,
  RefundStatusType,
} from '@/dtos'

import { OrderCard } from './components'
import * as S from './styles'

interface OrdersListSectionProps {
  orders: OrderDTO[]
  customerId: string
  isLoading: boolean
  currentPage: number
  pageSize: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
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

export const OrdersListSection = ({
  orders,
  customerId,
  isLoading,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  formatCurrency,
  formatDate,
  onOrderUpdate,
  onRequestRefund,
  onChangeOrderStatus,
  onChangeRefundStatus,
  isOrderStatusLoading = false,
  isRefundStatusLoading = false,
}: OrdersListSectionProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <S.LoadingContainer>
            <p>Carregando pedidos...</p>
          </S.LoadingContainer>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent>
          <S.EmptyState>
            <S.EmptyIcon>
              <Package size={48} />
            </S.EmptyIcon>
            <S.EmptyTitle>Nenhum pedido encontrado</S.EmptyTitle>
            <S.EmptyDescription>
              Este cliente ainda não fez nenhum pedido ou nenhum pedido atende
              aos filtros selecionados.
            </S.EmptyDescription>
          </S.EmptyState>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <S.OrdersContainer>
          <S.OrdersList>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                customerId={customerId}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                onOrderUpdate={onOrderUpdate}
                onRequestRefund={onRequestRefund}
                onChangeOrderStatus={onChangeOrderStatus}
                onChangeRefundStatus={onChangeRefundStatus}
                isOrderStatusLoading={isOrderStatusLoading}
                isRefundStatusLoading={isRefundStatusLoading}
              />
            ))}
          </S.OrdersList>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <S.PaginationContainer>
              <S.PaginationInfo>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <S.PageSizeSelector>
                  <label htmlFor="pageSize">Itens por página:</label>
                  <select
                    id="pageSize"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </S.PageSizeSelector>
              </S.PaginationInfo>

              <S.PaginationControls>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  Anterior
                </Button>

                <S.PageNumbers>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      const distance = Math.abs(page - currentPage)
                      return distance <= 2 || page === 1 || page === totalPages
                    })
                    .map((page, index, array) => {
                      const prevPage = array[index - 1]
                      const showEllipsis = prevPage && page - prevPage > 1

                      return (
                        <div key={page}>
                          {showEllipsis && <S.Ellipsis>...</S.Ellipsis>}
                          <S.PageButton
                            active={page === currentPage}
                            onClick={() => onPageChange(page)}
                          >
                            {page}
                          </S.PageButton>
                        </div>
                      )
                    })}
                </S.PageNumbers>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                >
                  Próxima
                </Button>
              </S.PaginationControls>
            </S.PaginationContainer>
          )}
        </S.OrdersContainer>
      </CardContent>
    </Card>
  )
}
