import { Injectable } from '@nestjs/common';

import { ChatContext } from '@/application/chat/chat-context';
import { PromptConfig } from '@/application/chat/enums/configs.enum';
import { MessageRole } from '@/domain/chat/enums/message-role.enum';

import { BasePromptStrategy } from './base-prompt.strategy';
import { PromptStrategy } from './prompt-strategy.interface';

@Injectable()
export class BookstoreAssistantStrategy
  extends BasePromptStrategy
  implements PromptStrategy
{
  public getConfig(): PromptConfig {
    return PromptConfig.BOOKSTORE_ASSISTANT;
  }

  public generateContextualPrompt(
    message: string,
    context: ChatContext,
  ): string {
    let contextSection = `**CUSTOMER CONTEXT:**\n`;
    contextSection += `Name: ${context.username}\n\n`;

    // Conversation Summary (always included)
    if (
      context.conversationSummary &&
      context.conversationSummary !== 'No previous conversation history.'
    ) {
      contextSection += `**CONVERSATION SUMMARY:**\n${context.conversationSummary}\n\n`;
    }

    contextSection += `**RECENT MESSAGES:**\n`;
    context.lastMessages.forEach((msg) => {
      contextSection += `- ${
        msg.role === MessageRole.USER ? 'USER' : 'ASSISTANT'
      }: ${msg.content}\n`;
    });
    contextSection += `\n`;

    contextSection += `**PURCHASE HISTORY:**\n`;
    if (context.purchaseHistory) {
      const purchaseHistoryText =
        context.purchaseHistory.length > 0
          ? context.purchaseHistory
              .map((book) => `- "${book.title}" by ${book.author}`)
              .join('\n')
          : 'No previous purchases.';
      contextSection += `${purchaseHistoryText}\n\n`;
    }

    if (context.availableBooks !== undefined) {
      const catalogText =
        context.availableBooks.length === 0
          ? 'No more books available.'
          : context.availableBooks
              .map(
                (book) =>
                  `[${book.id}] "${book.title}" by ${book.author} - $${book.price.toFixed(2)}` +
                  ` (Stock: ${book.stock})`,
              )
              .join('\n');
      contextSection += `**AVAILABLE CATALOG - ONLY RECOMMEND FROM THESE BOOKS:**\n${catalogText}\n\n`;
    }

    contextSection += `**CURRENT USER MESSAGE:**\n${message}\n\n`;

    return contextSection;
  }
}
