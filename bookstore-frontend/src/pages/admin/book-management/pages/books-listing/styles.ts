import styled from 'styled-components'

export const BooksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.XL};
`

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.MD};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${(props) => props.theme.SPACING.SM};
  }
`

export const PaginationInfo = styled.div`
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
`

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`

export const PageInfo = styled.span`
  color: ${(props) => props.theme.COLORS.NEUTRAL_700};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  white-space: nowrap;
`
