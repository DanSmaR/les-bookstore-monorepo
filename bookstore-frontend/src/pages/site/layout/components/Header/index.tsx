import { BookOpen, List, MagnifyingGlass, ShoppingCart } from 'phosphor-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { Button, ProfileMenu } from '@/components'
import { useAuth, useCart } from '@/providers'
import { ROUTES } from '@/routes/constants'

import * as S from './styles'

export const Header = () => {
  // Auth state from provider
  const { isAuthenticated } = useAuth()
  const { totalItems: cartItemsCount } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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
              <ProfileMenu />
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
