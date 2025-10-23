import { Card } from '@/domain/user/card.entity';
import { CardBrand } from '@/domain/user/enums/card-brand.enum';
import { CardType } from '@/domain/user/enums/card-type.enum';

export class CardDTO {
  id: string;
  type: CardType;
  last4: string;
  brand: CardBrand;
  expirationMonth: number;
  expirationYear: number;

  constructor(entity: Card) {
    this.id = entity.id;
    this.type = entity.type;
    this.last4 = entity.getLast4();
    this.brand = entity.brand;
    this.expirationMonth = entity.expirationDate.getMonth() + 1;
    this.expirationYear = entity.expirationDate.getFullYear();
  }
}
