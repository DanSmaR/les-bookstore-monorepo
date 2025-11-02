import styled from 'styled-components'

import { defaultTheme } from '@/styles'

export const SearchAndFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.MD};
`

export const SearchRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.MD};

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-start;
  }
`

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
`

export const SearchIcon = styled.div`
  position: absolute;
  left: ${defaultTheme.SPACING.SM};
  top: 50%;
  transform: translateY(-50%);
  color: ${defaultTheme.COLORS.NEUTRAL_400};
  font-size: 16px;
  pointer-events: none;
  z-index: 1;
`

export const SearchInputWithIcon = styled.div`
  position: relative;
  width: 100%;

  /* Override Input padding to account for icon */
  input {
    padding-left: 40px !important;
  }
`

export const FiltersContainer = styled.div`
  display: block;
  padding-top: ${defaultTheme.SPACING.MD};
  border-top: 1px solid ${defaultTheme.COLORS.NEUTRAL_200};
`

export const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${defaultTheme.SPACING.MD};

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.SPACING.XS};
`

export const FilterLabel = styled.label`
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  font-weight: ${defaultTheme.FONT_WEIGHT.MEDIUM};
  color: ${defaultTheme.COLORS.NEUTRAL_700};
`

export const FilterActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.SPACING.MD};
  margin-top: ${defaultTheme.SPACING.LG};
`

export const ResultsInfo = styled.div`
  font-size: ${defaultTheme.FONT_SIZE.SMALL};
  color: ${defaultTheme.COLORS.NEUTRAL_500};
  margin-top: ${defaultTheme.SPACING.SM};
`
