import { Inject, Injectable } from '@nestjs/common';

import { BaseService } from '@/application/base.service';
import { EntityNotFoundException } from '@/application/exceptions';
import { ChatConversation } from '@/domain/chat/chat-conversation.entity';

import { ChatRepository } from '../interfaces/chat.repository';

@Injectable()
export class ChatService extends BaseService<ChatConversation> {
  constructor(
    @Inject('ChatRepository')
    private readonly chatRepository: ChatRepository,
  ) {
    super(chatRepository);
  }

  public async findByUserId(userId: string): Promise<ChatConversation | null> {
    return this.chatRepository.findByUserId(userId);
  }

  public async findByUserIdOrThrow(userId: string): Promise<ChatConversation> {
    const conversation = await this.findByUserId(userId);
    if (!conversation) {
      throw new EntityNotFoundException('ChatConversation', userId);
    }
    return conversation;
  }
}
