import { ChatContext } from '@/application/chat/chat-context';
import { PromptConfigTemplate } from '@/application/chat/config/prompt-config.interface';
import { PromptConfig } from '@/application/chat/enums/configs.enum';

export interface PromptStrategy {
  generatePrompt(message: string, context?: ChatContext): string;
  generateContextualPrompt(
    message: string,
    context?: ChatContext,
    config?: PromptConfigTemplate,
  ): string;
  getConfig(): PromptConfig;
}
