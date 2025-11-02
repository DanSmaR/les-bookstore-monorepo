import { CaretDown, User } from 'phosphor-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useAuth, useToast } from '@/providers'
import { ROUTES } from '@/routes/constants'
import { getUserFromToken } from '@/utils'

import * as S from './styles'

interface ProfileMenuProps {
  className?: string
}

export const ProfileMenu = ({ className }: ProfileMenuProps) => {
  const { isAuthenticated, signOut, token } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Get user info from token to determine role
  const user = token ? getUserFromToken(token.accessToken) : null
  const isAdmin = user?.role === 'admin'

  const handleLogout = async () => {
    try {
      await signOut()
      toast.showSuccess('Sign out efetuado com sucesso.')
      navigate(ROUTES.SIGNIN)
      setIsMenuOpen(false)
    } catch {
      toast.showError('Erro ao desconectar. Tente novamente.')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <S.UserMenuContainer className={className}>
      <S.UserMenuButton
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        isOpen={isMenuOpen}
        data-testid="account-dropdown-button"
      >
        <S.UserAvatar>
          <User size={16} />
        </S.UserAvatar>
        <S.UserName>Minha Conta</S.UserName>
        <CaretDown size={16} className="dropdown-caret" />
      </S.UserMenuButton>

      {isMenuOpen && (
        <S.UserDropdown>
          {isAdmin ? (
            // Admin menu options
            <>
              <S.DropdownItem
                to={ROUTES.ADMIN}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </S.DropdownItem>
              <S.DropdownDivider />
              <S.DropdownButton onClick={handleLogout}>Sair</S.DropdownButton>
            </>
          ) : (
            // Regular user menu options
            <>
              <S.DropdownItem
                to={ROUTES.MY_PROFILE}
                onClick={() => setIsMenuOpen(false)}
              >
                Meu Perfil
              </S.DropdownItem>
              <S.DropdownItem
                to={ROUTES.ORDERS}
                onClick={() => setIsMenuOpen(false)}
                data-testid="orders-menu-link"
              >
                Meus Pedidos
              </S.DropdownItem>
              <S.DropdownItem
                to={ROUTES.PAYMENT_METHODS}
                onClick={() => setIsMenuOpen(false)}
              >
                Cartões
              </S.DropdownItem>
              <S.DropdownDivider />
              <S.DropdownButton onClick={handleLogout}>Sair</S.DropdownButton>
            </>
          )}
        </S.UserDropdown>
      )}
    </S.UserMenuContainer>
  )
}
