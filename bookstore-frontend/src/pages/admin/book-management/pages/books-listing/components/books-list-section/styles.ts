import styled from 'styled-components'

export const BookGrid = styled.div`
  display: grid;
  gap: ${(props) => props.theme.SPACING.MD};
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.SPACING.XXL};
  text-align: center;
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  background: ${(props) => props.theme.COLORS.NEUTRAL_50};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};

  p {
    font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
    margin: 0;
  }
`
