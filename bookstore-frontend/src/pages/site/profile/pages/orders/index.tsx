import { ArrowClockwise, Package, Storefront } from 'phosphor-react'
import { useState } from 'react'

import { Button, NavigationButton } from '@/components'
import type { OrderDTO, PaymentsDTO } from '@/dtos'
import { useCard, usePayment } from '@/hooks'
import { Container } from '@/pages/site/layout/styles'
import { useToast } from '@/providers'
import { ROUTES } from '@/routes/constants'

import { OrderCard, PaymentModal } from './components'
import * as S from './styles'
import { useOrders } from './use-orders'

export const Orders = () => {
  const {
    orders,
    totalOrders,
    orderStatistics,
    isLoading,
    error,
    handleRefreshOrders,
    handleCancelOrder,
    formatCurrency,
    formatDate,
  } = useOrders()

  const { getCards } = useCard()
  const { payOrder, isLoading: isPaymentLoading } = usePayment()
  const { showSuccess, showError } = useToast()

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null)

  const handlePayOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setIsPaymentModalOpen(true)
      getCards() // Load cards when opening modal
    }
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedOrder(null)
  }

  const handleConfirmPayment = async (payments: PaymentsDTO) => {
    if (!selectedOrder) return

    try {
      await payOrder(selectedOrder.id, payments)
      showSuccess('Seu pagamento foi processado com sucesso!')
      handleRefreshOrders() // Refresh orders to get updated status
      handleClosePaymentModal()
    } catch {
      showError('Não foi possível processar o pagamento. Tente novamente.')
    }
  }

  if (isLoading) {
    return (
      <Container>
        <S.ContentContainer>
          <S.LoadingContainer>
            <div>Carregando seus pedidos...</div>
          </S.LoadingContainer>
        </S.ContentContainer>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <S.ContentContainer>
          <S.ErrorContainer>
            <h3>Erro ao carregar pedidos</h3>
            <p>
              Não foi possível carregar seus pedidos. Verifique sua conexão com
              a internet e clique no botão abaixo para tentar novamente.
            </p>
            <Button onClick={handleRefreshOrders} variant="outline">
              <ArrowClockwise size={16} />
              Tentar novamente
            </Button>
          </S.ErrorContainer>
        </S.ContentContainer>
      </Container>
    )
  }

  return (
    <Container>
      <S.ContentContainer>
        <S.Header>
          <S.Title>Meus Pedidos</S.Title>
          <Button onClick={handleRefreshOrders} variant="outline" size="sm">
            <ArrowClockwise size={16} />
            Atualizar
          </Button>
        </S.Header>

        {totalOrders > 0 && (
          <S.OrdersStats>
            <S.StatCard>
              <h3>{totalOrders}</h3>
              <p>Total de Pedidos</p>
            </S.StatCard>
            <S.StatCard>
              <h3>{formatCurrency(orderStatistics.totalSpent)}</h3>
              <p>Valor Total Gasto</p>
            </S.StatCard>
            <S.StatCard>
              <h3>{formatCurrency(orderStatistics.averageOrderValue)}</h3>
              <p>Valor Médio por Pedido</p>
            </S.StatCard>
            <S.StatCard>
              <h3>{orderStatistics.totalItems}</h3>
              <p>Total de Livros</p>
            </S.StatCard>
          </S.OrdersStats>
        )}

        {orders.length === 0 ? (
          <S.EmptyState>
            <S.EmptyIcon>
              <Package size={48} />
            </S.EmptyIcon>
            <S.EmptyTitle>Nenhum pedido encontrado</S.EmptyTitle>
            <S.EmptyDescription>
              Você ainda não fez nenhum pedido. Que tal começar explorando nossa
              coleção de livros?
            </S.EmptyDescription>
            <NavigationButton to={ROUTES.CATALOG}>
              <Storefront size={16} />
              Explorar Livros
            </NavigationButton>
          </S.EmptyState>
        ) : (
          <S.OrdersList>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                onCancelOrder={handleCancelOrder}
                onPayOrder={handlePayOrder}
              />
            ))}
          </S.OrdersList>
        )}

        <PaymentModal
          isOpen={isPaymentModalOpen}
          order={selectedOrder}
          onClose={handleClosePaymentModal}
          onPayment={handleConfirmPayment}
          isLoading={isPaymentLoading}
        />
      </S.ContentContainer>
    </Container>
  )
}
