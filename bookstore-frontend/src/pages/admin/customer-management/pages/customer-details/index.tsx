import { ArrowLeft, User } from 'phosphor-react'
import { useParams } from 'react-router'

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  NavigationButton,
} from '@/components'
import { PageHeader } from '@/pages/admin/layout/components'
import { ROUTES } from '@/routes/constants'

import {
  CustomerAddressInfo,
  CustomerContactInfo,
  CustomerPersonalInfo,
  OrderHistorySidebar,
} from './components'
import * as S from './styles'
import { useCustomerDetails } from './use-customer-details'

export const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { customer, isLoading, error } = useCustomerDetails(id!)

  if (isLoading) {
    return (
      <S.CustomerDetailsContainer>
        <PageHeader
          title="Carregando..."
          subtitle="Buscando dados do cliente"
        />
        <Card>
          <CardContent>
            <p>Carregando dados do cliente...</p>
          </CardContent>
        </Card>
      </S.CustomerDetailsContainer>
    )
  }

  if (error || !customer) {
    return (
      <S.CustomerDetailsContainer>
        <PageHeader title="Erro" subtitle="Cliente não encontrado" />
        <Card>
          <CardContent>
            <p>Cliente não encontrado ou erro ao carregar os dados.</p>
            <NavigationButton variant="secondary" to={ROUTES.ADMIN_CUSTOMERS}>
              <ArrowLeft size={20} />
              Voltar para Lista
            </NavigationButton>
          </CardContent>
        </Card>
      </S.CustomerDetailsContainer>
    )
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'success'
      case 'Suspenso':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <S.CustomerDetailsContainer>
      <S.NavigationSection>
        <NavigationButton variant="secondary" to={ROUTES.ADMIN_CUSTOMERS}>
          <ArrowLeft size={20} />
          Voltar para Lista
        </NavigationButton>
      </S.NavigationSection>

      <PageHeader
        title={customer.name}
        subtitle={`Cliente desde ${new Date(customer.createdAt).toLocaleDateString('pt-BR')}`}
      />

      <S.ContentGrid>
        <S.MainContent>
          {/* Customer Status Card */}
          <Card>
            <CardHeader>
              <S.StatusHeader>
                <CardTitle>
                  <User size={24} />
                  Status da Conta
                </CardTitle>
                <Badge
                  variant={getStatusVariant(
                    customer.active ? 'Ativo' : 'Inativo',
                  )}
                >
                  {customer.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </S.StatusHeader>
            </CardHeader>
          </Card>

          {/* Personal Information */}
          <CustomerPersonalInfo customer={customer} />

          {/* Contact Information */}
          <CustomerContactInfo customer={customer} />

          {/* Address Information */}
          <CustomerAddressInfo addresses={customer.addresses} />
        </S.MainContent>

        <S.Sidebar>
          <OrderHistorySidebar customer={customer} />
        </S.Sidebar>
      </S.ContentGrid>
    </S.CustomerDetailsContainer>
  )
}
