import { ChatContext } from '@/application/chat/chat-context';
import { TEMPLATE_MAP } from '@/application/chat/config/default.config';
import { PromptConfigTemplate } from '@/application/chat/config/prompt-config.interface';
import { PromptConfig } from '@/application/chat/enums/configs.enum';

export abstract class BasePromptStrategy {
  public generatePrompt(message: string, context?: ChatContext): string {
    const config = TEMPLATE_MAP[this.getConfig()];

    let prompt = this.generateSystemRole(config);
    prompt += this.generateInstructions(config);
    prompt += this.generateContextualPrompt(message, context, config);
    prompt += this.generateResponseFormat(config);

    return prompt;
  }

  private generateInstructions(config: PromptConfigTemplate): string {
    let prompt = `**INSTRUCTIONS:**\n`;
    config.instructions.forEach((instruction, index) => {
      prompt += `${index + 1}. ${instruction}\n`;
    });
    prompt += '\n';
    return prompt;
  }

  private generateSystemRole(config: PromptConfigTemplate): string {
    return `${config.systemRole}\n\n`;
  }

  private generateResponseFormat(config: PromptConfigTemplate): string {
    return `You must ALWAYS return a JSON following this schema:\n\n${config.responseFormat.schemaDescription}\n\n`;
  }

  public abstract generateContextualPrompt(
    message: string,
    context?: ChatContext,
    config?: PromptConfigTemplate,
  ): string;

  public abstract getConfig(): PromptConfig;
}
