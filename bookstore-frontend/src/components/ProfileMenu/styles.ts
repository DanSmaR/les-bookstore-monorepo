import { Link } from 'react-router'
import styled from 'styled-components'

export const UserMenuContainer = styled.div`
  position: relative;
  display: block;
`

export const UserMenuButton = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};
  background: none;
  border: none;
  padding: ${(props) => props.theme.SPACING.SM};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};

  &:hover {
    background-color: ${(props) => props.theme.COLORS.NEUTRAL_100};
  }

  /* Only rotate the dropdown caret */
  .dropdown-caret {
    transform: ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 0.2s ease;
  }
`

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.COLORS.NEUTRAL_50};
`

export const UserName = styled.span`
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  display: block;
`

export const UserDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: ${(props) => props.theme.SPACING.SM};
  min-width: 192px;
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_50};
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: ${(props) => props.theme.SPACING.SM} 0;
  z-index: 50;
`

export const DropdownItem = styled(Link)`
  display: block;
  padding: ${(props) => `${props.theme.SPACING.SM} ${props.theme.SPACING.MD}`};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.COLORS.NEUTRAL_100};
  }
`

export const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: ${(props) => `${props.theme.SPACING.SM} ${props.theme.SPACING.MD}`};
  background: none;
  border: none;
  color: ${(props) => props.theme.COLORS.ERROR_MAIN};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.COLORS.NEUTRAL_100};
  }
`

export const DropdownDivider = styled.hr`
  margin: ${(props) => props.theme.SPACING.SM} 0;
  border: none;
  border-top: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
`
