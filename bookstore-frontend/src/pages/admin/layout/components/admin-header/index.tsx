import { Book, Books, House, Users } from 'phosphor-react'
import { NavLink } from 'react-router'

import { ROUTES } from '@/routes/constants'

import * as S from './styles'

export const AdminHeader = () => {
  return (
    <S.HeaderContainer>
      <S.HeaderContent>
        <S.Title>
          <Book size={32} />
          Bookstore Admin
        </S.Title>
        <nav>
          <NavLink to={ROUTES.HOME}>
            <House size={24} />
            <span>Home</span>
          </NavLink>
          <NavLink to={ROUTES.ADMIN_CUSTOMERS}>
            <Users size={24} />
            <span>Clientes</span>
          </NavLink>
          <NavLink to={ROUTES.ADMIN_BOOKS}>
            <Books size={24} />
            <span>Livros</span>
          </NavLink>
        </nav>
      </S.HeaderContent>
    </S.HeaderContainer>
  )
}
