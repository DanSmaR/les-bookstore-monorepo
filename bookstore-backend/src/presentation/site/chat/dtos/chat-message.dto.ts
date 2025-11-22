import { ChatMessage } from '@/domain/chat/chat-message.entity';
import { MessageRole } from '@/domain/chat/enums/message-role.enum';

export interface RecommendedBook {
  id: string;
  title: string;
}

export class ChatMessageDTO {
  content: string;
  role: MessageRole;
  sentAt: Date;
  booksRecommended: RecommendedBook[];

  constructor(entity: ChatMessage) {
    this.content = entity.content;
    this.role = entity.role;
    this.sentAt = entity.sentAt;
    this.booksRecommended = entity.metadata?.booksRecommended || [];
  }
}
