import { styled } from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const BackNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    font-size: 0.875rem;

    &:hover {
      text-decoration: underline;
    }
  }
`

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_900};
  margin: 0;
`

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
  margin: 0;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`
