import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DomainEntity } from '@/domain/domain.entity';
import { Card } from '@/domain/user/card.entity';

import { Order } from '../order.entity';
import { PaymentMethod } from './enums/payment-method.enum';
import { PaymentStatus } from './enums/payment-status.enum';

@Entity('tb_payments')
export class Payment extends DomainEntity {
  @Column()
  amountInCents: number;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus = PaymentStatus.PENDING;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column()
  gatewayTransactionId: string;

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Card, { nullable: true })
  @JoinColumn()
  card?: Card;

  @Column({ nullable: true })
  processedAt?: Date;

  @Column({ nullable: true })
  failureReason?: string;

  constructor(props: {
    amountInCents: number;
    method: PaymentMethod;
    gatewayTransactionId: string;
    card?: Card;
  }) {
    super();
    if (props) {
      this.amountInCents = props.amountInCents;
      this.method = props.method;
      this.gatewayTransactionId = props.gatewayTransactionId;
      this.card = props.card;
    }
  }

  public markAsPaid() {
    this.status = PaymentStatus.SUCCEEDED;
    this.processedAt = new Date();
  }
}
