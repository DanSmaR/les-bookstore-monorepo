import { Inject, Injectable } from '@nestjs/common';

import { ChatContext } from '../../chat-context';
import { PromptConfig } from '../../enums/configs.enum';
import { PromptStrategy } from './strategies/prompt-strategy.interface';

@Injectable()
export class PromptFactory {
  private readonly strategiesMap: Map<PromptConfig, PromptStrategy>;

  constructor(@Inject('PromptStrategies') strategies: PromptStrategy[]) {
    this.strategiesMap = new Map();
    strategies.forEach((strategy) => {
      this.strategiesMap.set(strategy.getConfig(), strategy);
    });
  }

  public createPrompt(
    message: string,
    config: PromptConfig,
    context?: ChatContext,
  ): string {
    const strategy = this.getStrategy(config);
    if (!strategy) {
      throw new Error(`No strategy found for config: ${config}`);
    }
    return strategy.generatePrompt(message, context);
  }

  private getStrategy(config: PromptConfig): PromptStrategy | undefined {
    return this.strategiesMap.get(config);
  }
}
