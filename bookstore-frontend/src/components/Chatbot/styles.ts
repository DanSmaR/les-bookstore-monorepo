import styled, { keyframes } from 'styled-components'

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`

export const FloatingButton = styled.button`
  position: fixed;
  bottom: ${({ theme }) => theme.SPACING.XXL};
  right: ${({ theme }) => theme.SPACING.XXL};
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  padding: ${({ theme }) => theme.SPACING.LG};
  border-radius: 50%;
  border: none;
  box-shadow: ${({ theme }) => theme.SHADOWS.LG};
  cursor: pointer;
  transition: all ${({ theme }) => theme.TRANSITIONS.NORMAL};
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.SHADOWS.FOCUS}
      ${({ theme }) => theme.COLORS.PRIMARY_LIGHT}40;
  }
`

export const ChatWindow = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.SPACING.XXL};
  right: ${({ theme }) => theme.SPACING.XXL};
  width: 384px;
  height: 600px;
  background-color: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  box-shadow: ${({ theme }) => theme.SHADOWS.LG};
  display: flex;
  flex-direction: column;
  z-index: 50;
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  overflow: hidden;
`

export const ChatHeader = styled.div`
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  padding: ${({ theme }) => theme.SPACING.LG};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG}
    ${({ theme }) => theme.BORDER_RADIUS.LG} 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ChatTitle = styled.h3`
  font-size: ${({ theme }) => theme.FONT_SIZE.MEDIUM};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  margin: 0;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.XS};
`

export const ResetButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  padding: ${({ theme }) => theme.SPACING.XS};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.TRANSITIONS.NORMAL};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.SHADOWS.FOCUS}
      ${({ theme }) => theme.COLORS.PRIMARY_LIGHT}40;
  }
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  padding: ${({ theme }) => theme.SPACING.XS};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.TRANSITIONS.NORMAL};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.SHADOWS.FOCUS}
      ${({ theme }) => theme.COLORS.PRIMARY_LIGHT}40;
  }
`

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.SPACING.LG};
  background-color: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.LG};
`

export const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.COLORS.NEUTRAL_500};
  margin-top: ${({ theme }) => theme.SPACING.XXXL};
`

export const EmptyStateTitle = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  margin: ${({ theme }) => theme.SPACING.SM} 0;
`

export const EmptyStateSubtitle = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.XSMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_400};
  margin-top: ${({ theme }) => theme.SPACING.SM};
`

export const MessageWrapper = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
`

export const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: ${({ theme }) => theme.SPACING.MD};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  white-space: pre-wrap;
  word-wrap: break-word;

  ${({ isUser, theme }) =>
    isUser
      ? `
    background-color: ${theme.COLORS.PRIMARY_MAIN};
    color: ${theme.COLORS.NEUTRAL_50};
  `
      : `
    background-color: ${theme.COLORS.NEUTRAL_50};
    color: ${theme.COLORS.NEUTRAL_800};
    border: 1px solid ${theme.COLORS.NEUTRAL_200};
  `}
`

export const RecommendedBooksContainer = styled.div`
  margin-top: ${({ theme }) => theme.SPACING.SM};
  padding-top: ${({ theme }) => theme.SPACING.SM};
  border-top: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_300};
`

export const RecommendedBooksTitle = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.XSMALL};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.MEDIUM};
  margin-bottom: ${({ theme }) => theme.SPACING.XS};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_600};
`

export const RecommendedBooksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.SPACING.XS};
`

export const RecommendedBookCard = styled.div`
  font-size: ${({ theme }) => theme.FONT_SIZE.XSMALL};
  padding: ${({ theme }) => theme.SPACING.SM};
  background-color: ${({ theme }) => theme.COLORS.NEUTRAL_100};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.SM};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  transition: all ${({ theme }) => theme.TRANSITIONS.NORMAL};
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${({ theme }) => theme.COLORS.PRIMARY_LIGHTER}20;
    border-color: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.SHADOWS.SM};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.SHADOWS.FOCUS}
      ${({ theme }) => theme.COLORS.PRIMARY_LIGHT}40;
    border-color: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
  }
`

export const LoadingIndicator = styled.div`
  display: flex;
  justify-content: flex-start;
`

export const LoadingBubble = styled.div`
  background-color: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  padding: ${({ theme }) => theme.SPACING.MD};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.SPACING.XS};
`

export const LoadingDots = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.SPACING.XS};
`

export const LoadingDot = styled.div<{ delay: string }>`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.COLORS.NEUTRAL_400};
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out;
  animation-delay: ${({ delay }) => delay};
`

export const LoadingMessage = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.XSMALL};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_500};
  text-align: center;
  display: block;
`

export const InputContainer = styled.div`
  padding: ${({ theme }) => theme.SPACING.LG};
  border-top: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_200};
  background-color: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  border-radius: 0 0 ${({ theme }) => theme.BORDER_RADIUS.LG}
    ${({ theme }) => theme.BORDER_RADIUS.LG};
`

export const InputWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.SPACING.SM};
`

export const ChatInput = styled.input`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.COLORS.NEUTRAL_300};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  padding: ${({ theme }) => `${theme.SPACING.MD} ${theme.SPACING.LG}`};
  font-size: ${({ theme }) => theme.FONT_SIZE.SMALL};
  font-family: inherit;
  transition: all ${({ theme }) => theme.TRANSITIONS.NORMAL};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
    box-shadow: ${({ theme }) => theme.SHADOWS.FOCUS}
      ${({ theme }) => theme.COLORS.PRIMARY_LIGHT}40;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.COLORS.NEUTRAL_100};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${({ theme }) => theme.COLORS.NEUTRAL_400};
  }
`

export const SendButton = styled.button`
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_MAIN};
  color: ${({ theme }) => theme.COLORS.NEUTRAL_50};
  padding: ${({ theme }) => theme.SPACING.SM};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS.LG};
  border: none;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.TRANSITIONS.NORMAL};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.COLORS.NEUTRAL_300};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.SHADOWS.FOCUS}
      ${({ theme }) => theme.COLORS.PRIMARY_LIGHT}40;
  }
`

