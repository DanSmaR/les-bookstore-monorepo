import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DomainEntity } from '../domain.entity';
import { CustomerDetails } from './customer-details.entity';
import { CardBrand } from './enums/card-brand.enum';
import { CardType } from './enums/card-type.enum';

@Entity('tb_cards')
export class Card extends DomainEntity {
  @Column()
  number: string;

  @Column({ type: 'enum', enum: CardType })
  type: CardType;

  @Column({ type: 'enum', enum: CardBrand })
  brand: CardBrand;

  @Column()
  expirationDate: Date;

  @Column()
  cvv: string;

  @Column()
  holderName: string;

  @ManyToOne(() => CustomerDetails, (customerDetails) => customerDetails.cards)
  @JoinColumn()
  customerDetails: CustomerDetails;

  constructor(props: {
    number: string;
    type: CardType;
    expirationDate: Date;
    cvv: string;
    holderName: string;
    brand: CardBrand;
  }) {
    super();
    if (props) {
      this.number = props.number;
      this.type = props.type;
      this.expirationDate = props.expirationDate;
      this.cvv = props.cvv;
      this.holderName = props.holderName;
      this.brand = props.brand;
    }
  }

  public getLast4(): string {
    return this.number.slice(-4);
  }

  public override equals(other: Card): boolean {
    return this.number === other.number;
  }
}
