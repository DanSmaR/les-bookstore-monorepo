import type {
  ChatConversationDTO,
  ChatMessageDTO,
  ChatMessageResponseDTO,
} from '@/dtos/chat'

import { AxiosApp } from './axios-app'

/**
 * Transform date strings to Date objects in chat messages
 */
const transformMessageDates = (message: ChatMessageDTO): ChatMessageDTO => {
  return {
    ...message,
    sentAt:
      typeof message.sentAt === 'string'
        ? new Date(message.sentAt)
        : message.sentAt,
  }
}

/**
 * Transform date strings in conversation
 */
const transformConversationDates = (
  conversation: ChatConversationDTO,
): ChatConversationDTO => {
  return {
    ...conversation,
    messages: conversation.messages.map(transformMessageDates),
  }
}

/**
 * Transform date strings in message response
 */
const transformMessageResponseDates = (
  response: ChatMessageResponseDTO,
): ChatMessageResponseDTO => {
  return {
    userMessage: transformMessageDates(response.userMessage),
    assistantMessage: transformMessageDates(response.assistantMessage),
  }
}

/**
 * Chat API Service
 * Handles all chat-related API calls
 */
export class ChatService {
  /**
   * Get active conversation for the authenticated user
   */
  static async getConversation(): Promise<ChatConversationDTO> {
    const response = await AxiosApp.get<ChatConversationDTO>('/chat')
    return transformConversationDates(response.data)
  }

  /**
   * Send a message to the chat
   */
  static async sendMessage(message: string): Promise<ChatMessageResponseDTO> {
    const response = await AxiosApp.post<ChatMessageResponseDTO>(
      '/chat/messages',
      { message },
    )
    return transformMessageResponseDates(response.data)
  }

  /**
   * Reset the conversation (delete all messages)
   */
  static async resetConversation(): Promise<void> {
    await AxiosApp.delete('/chat')
  }
}
