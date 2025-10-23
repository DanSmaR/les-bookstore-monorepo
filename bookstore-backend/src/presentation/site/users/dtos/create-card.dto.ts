import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

import { CardType } from '@/domain/user/enums/card-type.enum';

export class CreateCardDTO {
  @IsNumberString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  holderName: string;

  @IsDate()
  @Type(() => Date)
  expirationDate: Date;

  @IsEnum(CardType)
  @IsNotEmpty()
  type: CardType;

  @IsString()
  @IsNotEmpty()
  cvv: string;
}
