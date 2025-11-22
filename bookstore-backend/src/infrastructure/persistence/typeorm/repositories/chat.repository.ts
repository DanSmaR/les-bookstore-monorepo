import { ChatConversation } from '@domain/chat/chat-conversation.entity';
import { CRUDRepository } from '@infrastructure/persistence/typeorm/repositories';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatRepository } from '@/application/chat/interfaces/chat.repository';

@Injectable()
export class ChatRepositoryImpl
  extends CRUDRepository<ChatConversation>
  implements ChatRepository
{
  constructor(
    @InjectRepository(ChatConversation)
    repository: Repository<ChatConversation>,
  ) {
    super(repository);
  }

  public async findByUserId(userId: string): Promise<ChatConversation | null> {
    return await this.repository.findOne({
      where: { user: { id: userId } },
      order: {
        _messages: {
          createdAt: 'DESC',
        },
      },
    });
  }
}
