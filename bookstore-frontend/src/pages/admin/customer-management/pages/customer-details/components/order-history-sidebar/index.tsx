import { Package } from 'phosphor-react'

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  NavigationButton,
} from '@/components'
import type { CustomerDTO } from '@/dtos/user/customer.dto'
import { createRoute } from '@/routes/constants'

import * as S from './styles'

interface OrderHistorySidebarProps {
  customer: CustomerDTO | null
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'confirmed':
        return 'Confirmado'
      case 'shipped':
        return 'Enviado'
      case 'delivered':
        return 'Entregue'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Desconhecido'
    }
  }

  const getStatusVariant = (
    status: string,
  ): 'default' | 'secondary' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'confirmed':
        return 'secondary'
      case 'shipped':
        return 'default'
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  const orders = customer?.recentOrders || []

  const totalOrderValue = orders.reduce(
    (sum, order) => sum + ((order.subtotal || 0) - (order.discount || 0)),
    0,
  )

  const recentOrders = orders.slice(0, 5) // Show only 5 most recent orders

  const showAllOrdersRoute = customer
    ? createRoute.adminCustomerOrders(customer.id)
    : '#'

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Package size={24} />
          Histórico de Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <S.Container>
          {recentOrders.length === 0 ? (
            <S.EmptyState>
              <Package size={48} />
              <p>Nenhum pedido encontrado</p>
            </S.EmptyState>
          ) : (
            <>
              <S.OrdersList>
                {recentOrders.map((order) => {
                  const finalTotal = order.subtotal - (order.discount || 0)
                  const hasDiscount =
                    order.discount != null && order.discount > 0

                  return (
                    <S.OrderItem key={order.id}>
                      <S.OrderHeader>
                        <S.OrderId>#{order.id.slice(-8)}</S.OrderId>
                        <Badge
                          variant={getStatusVariant(order.status)}
                          size="sm"
                        >
                          {getStatusLabel(order.status)}
                        </Badge>
                      </S.OrderHeader>

                      <S.OrderDate>{formatDate(order.orderDate)}</S.OrderDate>

                      <S.OrderDetails>
                        <S.ItemsCount>
                          {order.totalItems}{' '}
                          {order.totalItems === 1 ? 'item' : 'itens'}
                        </S.ItemsCount>

                        <S.PriceInfo>
                          <S.Subtotal>
                            Subtotal: {formatCurrency(order.subtotal)}
                          </S.Subtotal>

                          {hasDiscount && (
                            <S.Discount>
                              Desconto: -{formatCurrency(order.discount!)}
                            </S.Discount>
                          )}

                          <S.Total hasDiscount={hasDiscount}>
                            Total: {formatCurrency(finalTotal)}
                          </S.Total>
                        </S.PriceInfo>
                      </S.OrderDetails>
                    </S.OrderItem>
                  )
                })}
              </S.OrdersList>

              <S.ShowAllButton>
                <NavigationButton
                  to={showAllOrdersRoute}
                  variant="secondary"
                  data-testid="show-all-orders-button"
                >
                  Mostrar tudo
                </NavigationButton>
              </S.ShowAllButton>
            </>
          )}
        </S.Container>
      </CardContent>
    </Card>
  )
}
