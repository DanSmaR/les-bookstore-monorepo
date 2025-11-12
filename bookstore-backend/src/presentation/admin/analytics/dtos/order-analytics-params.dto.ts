import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty } from 'class-validator';

import { Period } from './chart/period.enum';

export class OrderAnalyticsParamsDTO {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsEnum(Period)
  @IsNotEmpty()
  period: Period;
}
