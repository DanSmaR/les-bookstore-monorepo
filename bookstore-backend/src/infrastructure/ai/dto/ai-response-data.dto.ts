import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { AiAction } from '../enums/ai-action.enum';

export class RecommendedBook {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  constructor(id?: string, title?: string) {
    this.id = id || '';
    this.title = title || '';
  }
}

export class AiResponseMetadata {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecommendedBook)
  @IsOptional()
  booksRecommended?: RecommendedBook[] = [];

  @IsOptional()
  @IsArray()
  @IsEnum(AiAction, { each: true })
  requiredActions?: AiAction[] = [];

  @IsOptional()
  @IsNumber()
  nextPage?: number = 1;
}

export class AiResponseData {
  @IsString()
  message: string;

  @Type(() => AiResponseMetadata)
  @IsOptional()
  metadata?: AiResponseMetadata;

  constructor(message?: string, metadata?: AiResponseMetadata) {
    this.message = message || '';
    this.metadata = metadata;
  }
}
