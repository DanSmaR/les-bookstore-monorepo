import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.SPACING.MD};
  align-items: end;

  @media (max-width: ${({ theme }) => theme.BREAKPOINTS.MOBILE}) {
    flex-direction: column;
    align-items: stretch;
  }
`
