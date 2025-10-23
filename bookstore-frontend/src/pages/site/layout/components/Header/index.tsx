import {
  BookOpen,
  CaretDown,
  List,
  MagnifyingGlass,
  ShoppingCart,
  User,
} from 'phosphor-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { Button } from '@/components'
import { useAuth, useCart, useToast } from '@/providers'
import { ROUTES } from '@/routes/constants'

import * as S from './styles'

export const Header = () => {
  // Auth state from provider
  const { isAuthenticated, signOut } = useAuth()
  const { totalItems: cartItemsCount } = useCart()
  const toast = useToast()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.CATALOG}?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleInputChange = (e: { target: { value: string } }) => {
    setSearchQuery(e.target.value)
  }

  return (
    <S.HeaderContainer>
      <S.Container>
        <S.HeaderContent>
          {/* Logo */}
          <S.LogoContainer>
            <Link to={ROUTES.HOME}>
              <S.LogoWrapper>
                <S.LogoIcon>
                  <BookOpen size={24} weight="bold" />
                </S.LogoIcon>
                <S.LogoText>BookStore</S.LogoText>
              </S.LogoWrapper>
            </Link>
          </S.LogoContainer>

          {/* Desktop Navigation */}
          <S.DesktopNav>
            <S.NavLink to={ROUTES.CATALOG}>Catálogo</S.NavLink>
          </S.DesktopNav>

          {/* Right side */}
          <S.RightSection>
            {/* Search */}
            <S.SearchContainer>
              <S.SearchForm onSubmit={handleSearch}>
                <S.SearchInput
                  type="text"
                  placeholder="Buscar livros..."
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                <S.SearchIcon type="submit">
                  <MagnifyingGlass size={16} />
                </S.SearchIcon>
              </S.SearchForm>
            </S.SearchContainer>

            {/* Cart */}
            <S.CartContainer>
              <Link to={ROUTES.CART} data-testid="cart-icon">
                <S.CartButton>
                  <ShoppingCart size={24} />
                  {cartItemsCount > 0 && (
                    <S.CartBadge data-testid="cart-badge">
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </S.CartBadge>
                  )}
                </S.CartButton>
              </Link>
            </S.CartContainer>

            {/* User menu */}
            {isAuthenticated ? (
              <S.UserMenuContainer>
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
                    <S.DropdownButton onClick={handleLogout}>
                      Sair
                    </S.DropdownButton>
                  </S.UserDropdown>
                )}
              </S.UserMenuContainer>
            ) : (
              <S.AuthButtons>
                <Link to={ROUTES.SIGNIN}>
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to={ROUTES.SIGNUP}>
                  <Button variant="primary" size="sm">
                    Cadastrar
                  </Button>
                </Link>
              </S.AuthButtons>
            )}

            {/* Mobile menu button */}
            <S.MobileMenuButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              isOpen={isMenuOpen}
            >
              <List size={24} />
            </S.MobileMenuButton>
          </S.RightSection>
        </S.HeaderContent>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <S.MobileNav>
            <S.MobileNavItem to={ROUTES.CATALOG}>Catálogo</S.MobileNavItem>

            {/* Mobile search */}
            <S.MobileSearchForm onSubmit={handleSearch}>
              <S.MobileSearchInput
                type="text"
                placeholder="Buscar livros..."
                value={searchQuery}
                onChange={handleInputChange}
              />
              <S.MobileSearchIcon type="submit">
                <MagnifyingGlass size={16} />
              </S.MobileSearchIcon>
            </S.MobileSearchForm>
          </S.MobileNav>
        )}
      </S.Container>
    </S.HeaderContainer>
  )
}
