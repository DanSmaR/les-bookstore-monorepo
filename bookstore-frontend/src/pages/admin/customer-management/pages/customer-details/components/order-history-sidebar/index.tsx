import { Package, ShoppingBag } from 'phosphor-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components'
import type { UserDTO } from '@/dtos/user/user'

import * as S from './styles'

interface OrderHistorySidebarProps {
  customer: UserDTO | null
}

export const OrderHistorySidebar = ({ customer }: OrderHistorySidebarProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const orders = customer?.orders || []

  const totalOrderValue = orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0,
  )

  const completedOrders = orders.length // For now, assume all orders are completed

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Package size={24} />
          Histórico de Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Order Statistics */}
        <S.StatsSection>
          <S.StatsGrid>
            <S.StatItem>
              <S.StatLabel>Total de Pedidos</S.StatLabel>
              <S.StatValue>{orders.length}</S.StatValue>
            </S.StatItem>

            <S.StatItem>
              <S.StatLabel>Pedidos Concluídos</S.StatLabel>
              <S.StatValue>{completedOrders}</S.StatValue>
            </S.StatItem>

            <S.StatItem>
              <S.StatLabel>Valor Total Comprado</S.StatLabel>
              <S.StatValue>{formatCurrency(totalOrderValue)}</S.StatValue>
            </S.StatItem>
          </S.StatsGrid>
        </S.StatsSection>

        {/* Recent Orders */}
        <S.OrderHistoryContainer>
          <S.SectionTitle>Pedidos Recentes</S.SectionTitle>

          {orders.length > 0 ? (
            orders.slice(0, 5).map((order, index) => (
              <S.OrderCard key={`order-${index}`}>
                <S.OrderHeader>
                  <S.OrderNumber>#{index + 1}</S.OrderNumber>
                  <S.OrderDate>{formatDate(order.orderDate)}</S.OrderDate>
                </S.OrderHeader>

                <S.OrderDetails>
                  <S.OrderValue>
                    {formatCurrency(order.totalPrice)}
                  </S.OrderValue>
                  <S.OrderStatus status="Entregue">Entregue</S.OrderStatus>
                  <S.ItemCount>
                    {order.totalItems}{' '}
                    {order.totalItems === 1 ? 'item' : 'itens'}
                  </S.ItemCount>
                </S.OrderDetails>

                {/* Order Items Details */}
                <S.OrderItemsDetails>
                  {order.items.slice(0, 2).map((item, itemIndex) => (
                    <S.OrderItemText key={`item-${itemIndex}`}>
                      {item.book.title} (x{item.quantity})
                    </S.OrderItemText>
                  ))}
                  {order.items.length > 2 && (
                    <S.OrderItemText>
                      + {order.items.length - 2} outros itens
                    </S.OrderItemText>
                  )}
                </S.OrderItemsDetails>
              </S.OrderCard>
            ))
          ) : (
            <S.EmptyOrders>
              <ShoppingBag size={48} />
              <p>Nenhum pedido encontrado</p>
            </S.EmptyOrders>
          )}
        </S.OrderHistoryContainer>
      </CardContent>
    </Card>
  )
}
