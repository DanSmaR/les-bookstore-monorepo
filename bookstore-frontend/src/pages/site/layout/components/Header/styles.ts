import { Link } from 'react-router'
import styled from 'styled-components'

export const HeaderContainer = styled.header`
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_50};
  border-bottom: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  position: sticky;
  top: 0;
  z-index: 40;
`

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.SPACING.LG};

  @media (max-width: 768px) {
    padding: 0 ${(props) => props.theme.SPACING.MD};
  }
`

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
  }
`

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};
`

export const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.COLORS.NEUTRAL_50};
`

export const LogoText = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
`

export const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.XL};

  @media (min-width: 768px) {
    display: flex;
  }
`

export const NavLink = styled(Link)`
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  text-decoration: none;
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  }
`

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.MD};
`

export const SearchContainer = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`

export const SearchForm = styled.form`
  position: relative;
`

export const SearchInput = styled.input`
  width: 256px;
  padding: ${(props) => `${props.theme.SPACING.SM} ${props.theme.SPACING.MD}`};
  padding-left: ${(props) => props.theme.SPACING.XL};
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
    box-shadow: 0 0 0 2px ${(props) => props.theme.COLORS.PRIMARY_MAIN}20;
  }

  &::placeholder {
    color: ${(props) => props.theme.COLORS.NEUTRAL_400};
  }
`

export const SearchIcon = styled.button`
  position: absolute;
  left: ${(props) => props.theme.SPACING.SM};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${(props) => props.theme.COLORS.NEUTRAL_400};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  }
`

export const CartContainer = styled.div`
  a {
    text-decoration: none;
  }
`

export const CartButton = styled.div`
  position: relative;
  padding: ${(props) => props.theme.SPACING.SM};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  transition: background-color 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => props.theme.COLORS.NEUTRAL_100};
  }
`

export const CartBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  color: ${(props) => props.theme.COLORS.NEUTRAL_50};
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`

export const AuthButtons = styled.div`
  display: none;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};

  @media (min-width: 768px) {
    display: flex;
  }

  a {
    text-decoration: none;
  }
`

export const MobileMenuButton = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.SPACING.SM};
  background: none;
  border: none;
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.COLORS.NEUTRAL_100};
  }

  @media (min-width: 768px) {
    display: none;
  }
`

export const MobileNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.MD};
  border-top: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  padding: ${(props) => props.theme.SPACING.MD} 0;

  @media (min-width: 768px) {
    display: none;
  }
`

export const MobileNavItem = styled(Link)`
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  text-decoration: none;
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  }
`

export const MobileSearchForm = styled.form`
  position: relative;
`

export const MobileSearchInput = styled.input`
  width: 100%;
  padding: ${(props) => `${props.theme.SPACING.SM} ${props.theme.SPACING.MD}`};
  padding-left: ${(props) => props.theme.SPACING.XL};
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
    box-shadow: 0 0 0 2px ${(props) => props.theme.COLORS.PRIMARY_MAIN}20;
  }

  &::placeholder {
    color: ${(props) => props.theme.COLORS.NEUTRAL_400};
  }
`

export const MobileSearchIcon = styled.button`
  position: absolute;
  left: ${(props) => props.theme.SPACING.SM};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${(props) => props.theme.COLORS.NEUTRAL_400};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  }
`
