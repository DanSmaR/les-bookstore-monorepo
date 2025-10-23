import { ShoppingCart, Trash } from 'phosphor-react'
import { useNavigate } from 'react-router'

import { Button } from '@/components'
import { ROUTES } from '@/routes/constants'

import * as S from './styles'

export const EmptyCart = () => {
  const navigate = useNavigate()

  const handleGoToCatalog = () => {
    navigate(ROUTES.CATALOG)
  }

  return (
    <S.EmptyCartContainer>
      <S.EmptyCartIcon>
        <Trash size={64} />
      </S.EmptyCartIcon>

      <S.EmptyCartTitle>Seu carrinho está vazio</S.EmptyCartTitle>

      <S.EmptyCartDescription>
        Parece que você ainda não adicionou nenhum livro ao seu carrinho.
        Explore nosso catálogo e encontre suas próximas leituras!
      </S.EmptyCartDescription>

      <S.ActionButton>
        <Button variant="primary" size="lg" onClick={handleGoToCatalog}>
          <ShoppingCart size={20} />
          Explorar Catálogo
        </Button>
      </S.ActionButton>
    </S.EmptyCartContainer>
  )
}
