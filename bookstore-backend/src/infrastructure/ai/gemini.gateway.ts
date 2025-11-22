import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { AiGateway } from '@/application/chat/interfaces/ai.gateway';
import { AiResponseDTO } from '@/application/chat/interfaces/ai-response.dto';

import { AiResponseData } from './dto/ai-response-data.dto';

@Injectable()
export class GeminiGateway implements AiGateway {
  private readonly logger = new Logger(GeminiGateway.name);
  private readonly ai: GoogleGenAI;
  private readonly timeout: number;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.ai = new GoogleGenAI({
      apiKey,
    });

    // Configurable timeout (default: 30 seconds)
    this.timeout = this.configService.get<number>('AI_TIMEOUT_MS') || 30000;
  }

  public async generateResponse(message: string): Promise<AiResponseDTO> {
    this.logger.debug('Prompt preview', message);

    const modelName =
      this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash-exp';

    try {
      // Wrap API call with timeout
      const result = await this.executeWithTimeout(
        this.ai.models.generateContent({
          model: modelName,
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
        this.timeout,
      );

      const responseText =
        result.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return this.parseResponse(responseText);
    } catch (error) {
      if (error instanceof RequestTimeoutException) {
        this.logger.error(
          `AI request timeout after ${this.timeout}ms`,
          error.stack,
        );
        throw error;
      }
      this.logger.error('Error calling Gemini API', error);
      throw error;
    }
  }

  /**
   * Execute a promise with timeout
   */
  private async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new RequestTimeoutException(
                `AI request exceeded ${timeoutMs}ms timeout`,
              ),
            ),
          timeoutMs,
        ),
      ),
    ]);
  }

  private parseResponse(responseText: string): AiResponseDTO {
    // Clean the response text to extract JSON
    let cleanedText = responseText.trim();

    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    this.logger.debug('Cleaned response text', cleanedText);

    // Parse JSON
    const parsedData: unknown = JSON.parse(cleanedText);

    // Transform to our DTO using class-transformer
    const aiResponseData = plainToInstance(AiResponseData, parsedData);

    // Validate using class-validator
    const validationErrors = validateSync(aiResponseData);

    if (validationErrors.length > 0) {
      this.logger.warn('Validation errors in AI response', validationErrors);
      // Return fallback response if validation fails
      const fallbackMessage =
        typeof parsedData === 'object' &&
        parsedData !== null &&
        'message' in parsedData &&
        typeof parsedData.message === 'string'
          ? parsedData.message
          : 'Resposta inválida do assistente.';
      throw new Error(`Invalid AI response data: ${fallbackMessage}`);
    }

    // Convert to AiResponseDTO
    return new AiResponseDTO(aiResponseData.message, {
      booksRecommended: aiResponseData.metadata?.booksRecommended || [],
      requiredActions: aiResponseData.metadata?.requiredActions || [],
      nextPage: aiResponseData.metadata?.nextPage,
    });
  }
}
