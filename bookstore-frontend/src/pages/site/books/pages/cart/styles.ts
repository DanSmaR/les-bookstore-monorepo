import styled from 'styled-components'

export const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.SPACING.XL};
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    padding: ${(props) => props.theme.SPACING.LG};
  }
`

export const CartHeader = styled.div`
  margin-bottom: ${(props) => props.theme.SPACING.XL};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${(props) => props.theme.SPACING.SM};
  }
`

export const CartTitle = styled.h1`
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  font-size: ${(props) => props.theme.FONT_SIZE.XLARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
`

export const CartItemCount = styled.p`
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
`

export const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${(props) => props.theme.SPACING.XL};
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: ${(props) => props.theme.SPACING.LG};
  }
`

export const CartItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.LG};
`

export const CartSidePanel = styled.div`
  position: sticky;
  top: ${(props) => props.theme.SPACING.XL};

  @media (max-width: 1024px) {
    position: static;
  }
`
