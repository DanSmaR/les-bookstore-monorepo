import { ChatMessage } from '@/domain/chat/chat-message.entity';

import { ChatMessageDTO } from './chat-message.dto';

export class ChatMessageResponseDTO {
  userMessage: ChatMessageDTO;
  assistantMessage: ChatMessageDTO;

  constructor(userMessage: ChatMessage, assistantMessage: ChatMessage) {
    this.userMessage = new ChatMessageDTO(userMessage);
    this.assistantMessage = new ChatMessageDTO(assistantMessage);
  }
}
