import { ArrowLeft } from 'phosphor-react'

import { NavigationLink } from '@/components'
import { ROUTES } from '@/routes'

import { BookAddForm } from './components/book-add-form'
import * as S from './styles'
import { useBookAdd } from './use-book-add'

export const NewBook = () => {
  const { form, handleSubmit, isLoading } = useBookAdd()

  return (
    <S.Container>
      <S.Header>
        <S.BackNavigation>
          <NavigationLink to={ROUTES.ADMIN_BOOKS} variant="muted">
            <ArrowLeft size={16} />
            Voltar para Livros
          </NavigationLink>
        </S.BackNavigation>

        <S.HeaderContent>
          <S.Title>Adicionar Novo Livro</S.Title>
          <S.Subtitle>
            Preencha as informações abaixo para adicionar um novo livro ao
            catálogo
          </S.Subtitle>
        </S.HeaderContent>
      </S.Header>

      <S.Content>
        <BookAddForm form={form} onSubmit={handleSubmit} loading={isLoading} />
      </S.Content>
    </S.Container>
  )
}
