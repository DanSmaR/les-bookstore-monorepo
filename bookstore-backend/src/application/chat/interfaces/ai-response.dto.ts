import { AiAction } from '@/infrastructure/ai/enums/ai-action.enum';

export interface RecommendedBook {
  id: string;
  title: string;
}

interface Metadata {
  booksRecommended?: RecommendedBook[];
  nextPage?: number;
  requiredActions?: AiAction[];
}
export class AiResponseDTO {
  message?: string;
  metadata?: Metadata;

  constructor(message?: string, metadata?: Metadata) {
    this.message = message;
    this.metadata = metadata;
  }
}
