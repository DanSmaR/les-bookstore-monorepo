import styled from 'styled-components'

export const SearchAndFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.MD};
`

export const SearchRow = styled.div`
  display: flex;
  gap: ${(props) => props.theme.SPACING.MD};
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
`

export const SearchIcon = styled.div`
  position: absolute;
  left: ${(props) => props.theme.SPACING.SM};
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  z-index: 2;
`

export const SearchInputWithIcon = styled.div`
  & input {
    padding-left: ${(props) => props.theme.SPACING.XXL};
  }
`

export const FiltersContainer = styled.div<{ show: boolean }>`
  max-height: ${(props) => (props.show ? '200px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`

export const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.SPACING.MD};
  padding-top: ${(props) => props.theme.SPACING.MD};
`

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.XS};
`

export const FilterLabel = styled.label`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_700};
`

export const ClearFiltersButtonWrapper = styled.div`
  display: flex;
  align-items: end;
  min-height: 58px;
`

export const ResultsInfo = styled.div`
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  text-align: center;
  padding-top: ${(props) => props.theme.SPACING.SM};
  border-top: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
`
