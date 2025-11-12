import { ArrowClockwise, Package } from 'phosphor-react'
import { useParams } from 'react-router'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components'
import type { OrderStatusType, RefundStatusType } from '@/dtos'
import type { RefundRequestDTO } from '@/dtos/refund'

import { OrdersListSection, SearchAndFilters } from './components'
import * as S from './styles'
import { useCustomerOrders } from './use-customer-orders'

export const CustomerOrders = () => {
  const { id: customerId } = useParams<{ id: string }>()

  const {
    // Data
    orders,
    customerInfo,
    totalOrders,
    isLoading,
    error,

    // Loading states
    isStatusLoading,
    isRefundLoading,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    setCurrentPage,
    setPageSize,

    // Search and filters
    searchTerm,
    statusFilter,
    startDate,
    endDate,
    setSearchTerm,
    setStatusFilter,
    setStartDate,
    setEndDate,
    clearFilters,

    // Actions
    refreshOrders,
    handleRequestRefund,
    handleChangeOrderStatus,
    handleChangeRefundStatus,
    formatCurrency,
    formatDate,
  } = useCustomerOrders(customerId!)

  // Wrapper functions to match expected signatures
  const handleRefundRequest = async (
    _customerId: string,
    orderId: string,
    refundData: RefundRequestDTO,
  ) => {
    return await handleRequestRefund(orderId, refundData)
  }

  const handleOrderStatusChange = async (
    orderId: string,
    newStatus: OrderStatusType,
  ) => {
    await handleChangeOrderStatus(orderId, newStatus)
  }

  const handleRefundStatusChange = async (
    orderId: string,
    refundId: string,
    newStatus: RefundStatusType,
  ) => {
    await handleChangeRefundStatus(orderId, refundId, newStatus)
  }

  if (error) {
    return (
      <S.ContentContainer>
        <S.ErrorContainer>
          <h3>Erro ao carregar pedidos</h3>
          <p>
            Não foi possível carregar os pedidos do cliente. Verifique sua
            conexão e tente novamente.
          </p>
          <Button onClick={refreshOrders} variant="outline">
            <ArrowClockwise size={16} />
            Tentar novamente
          </Button>
        </S.ErrorContainer>
      </S.ContentContainer>
    )
  }

  return (
    <S.ContentContainer>
      {/* Header */}
      <S.Header>
        <S.HeaderContent>
          <S.Title>Pedidos do Cliente</S.Title>
          {customerInfo && (
            <S.CustomerInfo>
              <S.CustomerName>{customerInfo.name}</S.CustomerName>
              <S.CustomerEmail>{customerInfo.email}</S.CustomerEmail>
            </S.CustomerInfo>
          )}
        </S.HeaderContent>
        <Button
          onClick={refreshOrders}
          variant="outline"
          size="sm"
          data-testid="refresh-orders-button"
        >
          <ArrowClockwise size={16} />
          Atualizar
        </Button>
      </S.Header>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Busca e Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClearFilters={clearFilters}
            resultsCount={orders.length}
            totalCount={totalOrders}
          />
        </CardContent>
      </Card>

      {/* Orders Statistics */}
      {totalOrders > 0 && (
        <S.StatsContainer>
          <S.StatCard data-testid="total-orders-stat">
            <S.StatIcon>
              <Package size={20} />
            </S.StatIcon>
            <S.StatContent>
              <S.StatValue>{totalOrders}</S.StatValue>
              <S.StatLabel>Total de Pedidos</S.StatLabel>
            </S.StatContent>
          </S.StatCard>
          <S.StatCard data-testid="filtered-orders-stat">
            <S.StatIcon>
              <Package size={20} />
            </S.StatIcon>
            <S.StatContent>
              <S.StatValue>{orders.length}</S.StatValue>
              <S.StatLabel>Pedidos Filtrados</S.StatLabel>
            </S.StatContent>
          </S.StatCard>
        </S.StatsContainer>
      )}

      {/* Orders List */}
      {isLoading ? (
        <Card>
          <CardContent>
            <S.LoadingContainer>
              <p>Carregando pedidos do cliente...</p>
            </S.LoadingContainer>
          </CardContent>
        </Card>
      ) : (
        <OrdersListSection
          orders={orders}
          customerId={customerId!}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          onOrderUpdate={refreshOrders}
          onRequestRefund={handleRefundRequest}
          onChangeOrderStatus={handleOrderStatusChange}
          onChangeRefundStatus={handleRefundStatusChange}
          isOrderStatusLoading={isStatusLoading}
          isRefundStatusLoading={isRefundLoading}
        />
      )}
    </S.ContentContainer>
  )
}
