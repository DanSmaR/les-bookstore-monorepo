import { BaseRepository } from '@/application/base.repository';
import { ChatConversation } from '@/domain/chat/chat-conversation.entity';

export interface ChatRepository extends BaseRepository<ChatConversation> {
  findByUserId(userId: string): Promise<ChatConversation | null>;
}
