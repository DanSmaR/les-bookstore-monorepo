import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatService } from '@/application/chat/services/chat.service';
import { PromptFactory } from '@/application/chat/use-cases/prompt-config/prompt.factory';
import { BookstoreAssistantStrategy } from '@/application/chat/use-cases/prompt-config/strategies/bookstore-assistant.strategy';
import { ConversationSummarizerStrategy } from '@/application/chat/use-cases/prompt-config/strategies/conversation-summarizer.strategy';
import { ResetChat } from '@/application/chat/use-cases/reset-chat.usecase';
import { SendMessage } from '@/application/chat/use-cases/send-message.usecase';
import { ChatConversation } from '@/domain/chat/chat-conversation.entity';
import { ChatMessage } from '@/domain/chat/chat-message.entity';
import { GeminiGateway } from '@/infrastructure/ai/gemini.gateway';
import { ChatRepositoryImpl } from '@/infrastructure/persistence/typeorm/repositories/chat.repository';
import { ChatSiteController } from '@/presentation/site/chat/chat-site.controller';
import { ChatSiteWebService } from '@/presentation/site/chat/chat-site.webservice';

import { BooksModule } from './books.module';
import { OrdersModule } from './orders.module';
import { UsersModule } from './users.module';

const USE_CASES = [SendMessage, ResetChat, PromptFactory];
const PROMPT_STRATEGIES = [
  BookstoreAssistantStrategy,
  ConversationSummarizerStrategy,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatConversation, ChatMessage]),
    BooksModule,
    OrdersModule,
    UsersModule,
  ],
  controllers: [ChatSiteController],
  providers: [
    ...PROMPT_STRATEGIES,
    {
      provide: 'PromptStrategies',
      useFactory: (...strategies: typeof PROMPT_STRATEGIES) => strategies,
      inject: [...PROMPT_STRATEGIES],
    },
    {
      provide: 'ChatRepository',
      useClass: ChatRepositoryImpl,
    },
    {
      provide: 'AiGateway',
      useClass: GeminiGateway,
    },
    ChatService,
    ChatSiteWebService,
    ...USE_CASES,
  ],
  exports: [ChatService, ...USE_CASES],
})
export class ChatModule {}
