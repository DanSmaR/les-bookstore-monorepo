import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DecimalColumn } from '../decorators/decimal-column.decorator';
import { DomainEntity } from '../domain.entity';
import { OrderItem } from './order-item.entity';
import { Refund } from './refund.entity';

@Entity('tb_refund_items')
export class RefundItem extends DomainEntity {
  @ManyToOne(() => Refund)
  @JoinColumn()
  refund: Refund;

  @ManyToOne(() => OrderItem, { eager: true })
  @JoinColumn()
  orderItem: OrderItem;

  @Column()
  quantity: number;

  @DecimalColumn()
  unitPrice: number;

  constructor(props: {
    orderItem: OrderItem;
    quantity: number;
    unitPrice: number;
  }) {
    super();
    if (props) {
      this.orderItem = props.orderItem;
      this.quantity = props.quantity;
      this.unitPrice = props.unitPrice;
    }
  }

  public getTotalPrice(): number {
    return this.quantity * this.unitPrice;
  }
}
