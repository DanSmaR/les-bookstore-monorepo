import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateNewOrderDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];

  @IsUUID()
  deliveryAddressId: string;

  @IsUUID()
  @IsOptional()
  ticketId?: string;
}

export class OrderItemDTO {
  @IsUUID()
  bookId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
