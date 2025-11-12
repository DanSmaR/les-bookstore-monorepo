import { Type } from 'class-transformer';
import {
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class RefundRequestDTO {
  @ValidateNested({ each: true })
  @Type(() => RefundRequestItemDTO)
  items: RefundRequestItemDTO[];

  @IsString()
  @IsOptional()
  reason?: string;
}

export class RefundRequestItemDTO {
  @IsUUID()
  bookId: string;

  @IsPositive()
  quantity: number;
}
