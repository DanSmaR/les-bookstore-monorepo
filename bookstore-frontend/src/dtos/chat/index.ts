export * from './chat-message.dto'

import type { ChatMessageDTO } from './chat-message.dto'

export interface ChatConversationDTO {
  id: string
  messages: ChatMessageDTO[]
}

export interface ChatMessageResponseDTO {
  userMessage: ChatMessageDTO
  assistantMessage: ChatMessageDTO
}

export interface SendMessageDTO {
  message: string
}

