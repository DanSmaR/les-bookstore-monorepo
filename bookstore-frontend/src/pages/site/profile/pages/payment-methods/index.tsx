import { CreditCard, Plus, Trash } from 'phosphor-react'

import { Button, ConfirmationModal } from '@/components'
import { Container } from '@/pages/site/layout/styles'

import { CardForm } from './components/CardForm'
import * as S from './styles'
import { usePaymentMethods } from './use-payment-methods'

export const PaymentMethods = () => {
  const {
    cards,
    isLoading,
    isSaving,
    isFormOpen,
    cardForm,
    handleFormSubmit,
    handleAddCard,
    handleCloseForm,
    handleDeleteCard,
    handleCloseDeleteModal,
    handleConfirmDeleteCard,
    isDeleteModalOpen,
    cardToDelete,
    getFormattedCardDisplay,
  } = usePaymentMethods()

  if (isLoading) {
    return (
      <Container>
        <S.ContentContainer>
          <S.LoadingContainer>
            <div>Carregando...</div>
          </S.LoadingContainer>
        </S.ContentContainer>
      </Container>
    )
  }

  return (
    <Container>
      <S.ContentContainer>
        <S.Header>
          <S.Title>Métodos de Pagamento</S.Title>
          <S.AddButton onClick={handleAddCard}>
            <Plus size={16} />
            Adicionar Cartão
          </S.AddButton>
        </S.Header>

        {cards.length === 0 ? (
          <S.EmptyState>
            <S.EmptyIcon>
              <CreditCard size={32} />
            </S.EmptyIcon>
            <S.EmptyTitle>Nenhum cartão cadastrado</S.EmptyTitle>
            <S.EmptyDescription>
              Adicione um cartão de crédito ou débito para facilitar suas
              compras
            </S.EmptyDescription>
            <Button variant="primary" onClick={handleAddCard}>
              <Plus size={16} />
              Adicionar primeiro cartão
            </Button>
          </S.EmptyState>
        ) : (
          <S.CardsList>
            {cards.map((card) => (
              <S.CardItem key={card.id}>
                <S.CardInfo>
                  <S.CardIcon>
                    <CreditCard size={24} />
                  </S.CardIcon>
                  <S.CardDetails>
                    <S.CardNumber>{getFormattedCardDisplay(card)}</S.CardNumber>
                    <S.CardType>
                      {card.brand} •{' '}
                      {card.type === 'credit' ? 'Crédito' : 'Débito'}
                    </S.CardType>
                    <S.CardExpiry>
                      Vence em{' '}
                      {card.expirationMonth.toString().padStart(2, '0')}/
                      {card.expirationYear.toString().slice(-2)}
                    </S.CardExpiry>
                  </S.CardDetails>
                </S.CardInfo>
                <S.CardActions>
                  <S.ActionButton
                    className="danger"
                    onClick={() => handleDeleteCard(card)}
                  >
                    <Trash size={16} />
                  </S.ActionButton>
                </S.CardActions>
              </S.CardItem>
            ))}
          </S.CardsList>
        )}

        <CardForm
          isOpen={isFormOpen}
          isLoading={isSaving}
          form={cardForm}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDeleteCard}
          title="Remover cartão"
          message={
            cardToDelete
              ? `Tem certeza que deseja remover o cartão ${getFormattedCardDisplay(cardToDelete)}?`
              : ''
          }
          confirmText="Remover"
          cancelText="Cancelar"
          variant="danger"
        />
      </S.ContentContainer>
    </Container>
  )
}
