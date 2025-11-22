import { ChatContext } from '../chat-context';
import { PromptConfigTemplate } from '../config/prompt-config.interface';
import { AiResponseDTO } from './ai-response.dto';

export interface AiGateway {
  generateResponse(
    message: string,
    context?: ChatContext,
    promptConfig?: PromptConfigTemplate,
  ): Promise<AiResponseDTO>;
}
