import { styled } from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const FullWidthField = styled.div`
  width: 100%;
`

export const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
