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
  // Allow empty array for orders fully covered by tickets (finalPrice = R$0.00)
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
  amount: number;
}
