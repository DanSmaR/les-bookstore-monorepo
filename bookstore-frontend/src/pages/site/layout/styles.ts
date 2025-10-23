import styled from 'styled-components'

export const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_50};
`

export const MainContent = styled.main`
  flex: 1;
  padding: ${(props) => props.theme.SPACING.XL} 0;

  @media (max-width: 768px) {
    padding: ${(props) => props.theme.SPACING.LG} 0;
  }
`

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.SPACING.LG};

  @media (max-width: 768px) {
    padding: 0 ${(props) => props.theme.SPACING.MD};
  }
`
