import styled from 'styled-components'

export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_800};
  margin-bottom: 8px;
`

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
`

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`

export const LoadingText = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
`

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 200px;
  justify-content: center;
`

export const ErrorText = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.COLORS.ERROR_MAIN};
`

export const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.COLORS.ERROR_LIGHTER};
  border: 1px solid ${({ theme }) => theme.COLORS.ERROR_MAIN};
  color: ${({ theme }) => theme.COLORS.ERROR_DARKER};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-weight: 500;
`

export const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.COLORS.SUCCESS_LIGHTER};
  border: 1px solid ${({ theme }) => theme.COLORS.SUCCESS_MAIN};
  color: ${({ theme }) => theme.COLORS.SUCCESS_DARKER};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-weight: 500;
`

export const FormContainer = styled.div`
  background: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
`

export const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_800};
  margin-bottom: 24px;
  text-align: center;
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`

export const FormActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`

export const ActionsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  justify-content: center;
  flex-wrap: wrap;
`

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`
