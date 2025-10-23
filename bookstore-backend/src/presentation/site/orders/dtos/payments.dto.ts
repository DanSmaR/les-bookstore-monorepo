import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PaymentsDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PaymentDTO)
  payments: PaymentDTO[];
}

class PaymentDTO {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amountInCents: number;
}
