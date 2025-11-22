import { ChatConversation } from '@/domain/chat/chat-conversation.entity';

import { ChatMessageDTO } from './chat-message.dto';

export class ChatConversationDTO {
  id: string;
  messages: ChatMessageDTO[];

  constructor(entity: ChatConversation) {
    this.id = entity.id;
    this.messages = entity.messages.map((msg) => new ChatMessageDTO(msg));
  }
}
