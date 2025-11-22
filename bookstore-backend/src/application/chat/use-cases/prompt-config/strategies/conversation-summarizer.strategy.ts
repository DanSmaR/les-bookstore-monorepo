import { Injectable } from '@nestjs/common';

import { PromptConfig } from '@/application/chat/enums/configs.enum';

import { BasePromptStrategy } from './base-prompt.strategy';
import { PromptStrategy } from './prompt-strategy.interface';

@Injectable()
export class ConversationSummarizerStrategy
  extends BasePromptStrategy
  implements PromptStrategy
{
  public generateContextualPrompt(message: string): string {
    return `**CONVERSATION TO SUMMARIZE:**\n${message}\n\n`;
  }

  public getConfig(): PromptConfig {
    return PromptConfig.CONVERSATION_SUMMARIZER;
  }
}
