import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateNewOrderDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];

  @IsString()
  @IsNotEmpty()
  deliveryAddressId: string;
}

export class OrderItemDTO {
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
