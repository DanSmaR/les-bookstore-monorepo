import styled, { keyframes } from 'styled-components'

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.SPACING.LG};
`

export const Header = styled.header`
  text-align: center;
  margin-bottom: ${(props) => props.theme.SPACING.XL};
`

export const Title = styled.h1`
  font-size: ${(props) => props.theme.FONT_SIZE.XXLARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  margin-bottom: ${(props) => props.theme.SPACING.XS};
`

export const Subtitle = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
`

export const FiltersSection = styled.section`
  background: ${(props) => props.theme.COLORS.NEUTRAL_50};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  padding: ${(props) => props.theme.SPACING.LG};
  margin-bottom: ${(props) => props.theme.SPACING.XL};
`

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};
  background: #fff;
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  padding: ${(props) => props.theme.SPACING.SM}
    ${(props) => props.theme.SPACING.MD};
  margin-bottom: ${(props) => props.theme.SPACING.MD};
  transition: border-color ${(props) => props.theme.TRANSITIONS.FAST};

  &:focus-within {
    border-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  }

  svg {
    color: ${(props) => props.theme.COLORS.NEUTRAL_600};
    flex-shrink: 0;
  }
`

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_900};

  &::placeholder {
    color: ${(props) => props.theme.COLORS.NEUTRAL_400};
  }
`

export const ClearSearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: ${(props) => props.theme.SPACING.XS};
  cursor: pointer;
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  transition: all ${(props) => props.theme.TRANSITIONS.FAST};

  &:hover {
    background: ${(props) => props.theme.COLORS.NEUTRAL_100};
    color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  }
`

export const FiltersRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${(props) => props.theme.SPACING.MD};
  flex-wrap: wrap;
`

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.MD};
  flex: 1;
`

export const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.XS};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const PriceFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.SM};
`

export const PriceLabel = styled.label`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
`

export const PriceInputs = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};

  > span {
    color: ${(props) => props.theme.COLORS.NEUTRAL_600};
    font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
    font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  }

  > div {
    flex: 1;
    max-width: 140px;
  }
`

export const CheckboxFilter = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  }

  label {
    font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
    color: ${(props) => props.theme.COLORS.NEUTRAL_600};
    cursor: pointer;
    user-select: none;
  }
`

export const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.XS};
  padding: ${(props) => props.theme.SPACING.SM}
    ${(props) => props.theme.SPACING.MD};
  background: #fff;
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  cursor: pointer;
  transition: all ${(props) => props.theme.TRANSITIONS.FAST};

  &:hover {
    background: ${(props) => props.theme.COLORS.NEUTRAL_100};
    border-color: ${(props) => props.theme.COLORS.NEUTRAL_300};
    color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  }
`

export const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${(props) => props.theme.SPACING.LG};
  margin-bottom: ${(props) => props.theme.SPACING.XL};
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.SPACING.XXL};
  gap: ${(props) => props.theme.SPACING.MD};
`

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-top-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

export const LoadingText = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.SPACING.XXL};
  gap: ${(props) => props.theme.SPACING.LG};
`

export const EmptyStateText = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  text-align: center;
`

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.SPACING.MD};
  padding: ${(props) => props.theme.SPACING.LG} 0;
`

export const PaginationButton = styled.button`
  padding: ${(props) => props.theme.SPACING.SM}
    ${(props) => props.theme.SPACING.LG};
  background: #fff;
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  cursor: pointer;
  transition: all ${(props) => props.theme.TRANSITIONS.FAST};

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.COLORS.NEUTRAL_100};
    border-color: ${(props) => props.theme.COLORS.NEUTRAL_300};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const PaginationInfo = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
`
