import { Injectable } from '@nestjs/common';

import { ChatService } from '@/application/chat/services/chat.service';
import { ResetChat } from '@/application/chat/use-cases/reset-chat.usecase';
import { SendMessage } from '@/application/chat/use-cases/send-message.usecase';

import { ChatConversationDTO } from './dtos/chat-conversation.dto';
import { ChatMessageResponseDTO } from './dtos/chat-message-response.dto';

@Injectable()
export class ChatSiteWebService {
  constructor(
    private readonly chatService: ChatService,
    private readonly sendMessageUseCase: SendMessage,
    private readonly resetChatUseCase: ResetChat,
  ) {}

  public async sendMessage(
    userId: string,
    message: string,
  ): Promise<ChatMessageResponseDTO> {
    const messages = await this.sendMessageUseCase.execute(userId, message);
    return new ChatMessageResponseDTO(
      messages.userMessage,
      messages.assistantMessage,
    );
  }

  public async getConversation(userId: string): Promise<ChatConversationDTO> {
    return new ChatConversationDTO(
      await this.chatService.findByUserIdOrThrow(userId),
    );
  }

  public async resetConversation(userId: string): Promise<void> {
    await this.resetChatUseCase.execute(userId);
  }
}
