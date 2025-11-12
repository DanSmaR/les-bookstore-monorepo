import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { DomainEntity } from '../domain.entity';
import { TicketNature } from '../ticket/enums/ticket-nature.enum';
import { Ticket } from '../ticket/ticket.entity';
import { Address } from '../user/address.entity';
import { CustomerDetails } from '../user/customer-details.entity';
import { RefundStatus } from './enums/refund-status.enum';
import { OrderStatus } from './enums/status.enum';
import { OrderItem } from './order-item.entity';
import { PaymentStatus } from './payment/enums/payment-status.enum';
import { Payment } from './payment/payment.entity';
import { Refund } from './refund.entity';
import { OrderStatusChangeTransformer } from './transformers/order-status-change.transformer';

@Entity('tb_orders')
export class Order extends DomainEntity {
  public static readonly MAX_PERIOD_TO_REFUND_IN_DAYS = 30;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    eager: true,
    cascade: true,
  })
  _items: OrderItem[];

  @Column()
  orderDate: Date = new Date();

  @Column({ name: 'status', type: 'enum', enum: OrderStatus })
  _status: OrderStatus = OrderStatus.PENDING;

  @Column({
    type: 'jsonb',
    default: [],
    transformer: OrderStatusChangeTransformer,
  })
  statusHistory: OrderStatusChange[] = [];

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn()
  deliveryAddress: Address;

  @OneToMany(() => Payment, (payment) => payment.order, {
    eager: true,
    cascade: true,
  })
  _payments: Payment[];

  @ManyToMany(() => Ticket, { eager: true })
  @JoinTable({
    name: 'tb_order_tickets',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ticket_id',
      referencedColumnName: 'id',
    },
  })
  _tickets: Ticket[];

  @ManyToOne(() => CustomerDetails, (customer) => customer.orders)
  @JoinColumn()
  customer: CustomerDetails;

  @OneToMany(() => Refund, (refund) => refund.order, {
    eager: true,
    cascade: true,
  })
  _refunds: Refund[];

  constructor(props: { customer: CustomerDetails; deliveryAddress: Address }) {
    super();
    if (props) {
      this.customer = props.customer;
      this.deliveryAddress = props.deliveryAddress;
    }
  }

  get items(): OrderItem[] {
    if (!this._items) {
      this._items = [];
    }
    return this._items;
  }

  get payments(): Payment[] {
    if (!this._payments) {
      this._payments = [];
    }
    return this._payments;
  }

  get tickets(): Ticket[] {
    if (!this._tickets) {
      this._tickets = [];
    }
    return this._tickets;
  }

  get refunds(): Refund[] {
    if (!this._refunds) {
      this._refunds = [];
    }
    return this._refunds;
  }

  get status(): OrderStatus {
    return this._status;
  }

  set status(newStatus: OrderStatus) {
    if (this._status !== newStatus) {
      this._status = newStatus;
      this.statusHistory.push(new OrderStatusChange(this._status, newStatus));
    }
  }

  public getPromotionalTicket(): Ticket | null {
    if (!this.tickets) return null;
    return (
      this.tickets.find((t) => t.nature === TicketNature.PROMOTIONAL) || null
    );
  }

  public getExchangeTickets(): Ticket[] {
    if (!this.tickets) return [];
    return this.tickets.filter((t) => t.nature === TicketNature.EXCHANGE);
  }

  public getTotalTicketsDiscount(): number {
    if (!this.tickets || this.tickets.length === 0) return 0;

    const subtotal = this.getSubtotal();
    let totalDiscount = 0;

    // 1. Aplicar cupom promocional primeiro (se houver)
    const promotional = this.getPromotionalTicket();
    if (promotional) {
      totalDiscount += promotional.applyTicket(subtotal);
    }

    // 2. Aplicar cupons de troca (uso integral de cada cupom)
    const remainingAmount = subtotal - totalDiscount;
    const exchangeTickets = this.getExchangeTickets();

    for (const ticket of exchangeTickets) {
      if (remainingAmount <= 0) break;

      const discountFromThisTicket = Math.min(ticket.value, remainingAmount);
      totalDiscount += discountFromThisTicket;
    }

    // Desconto não pode ser maior que subtotal
    return Math.min(totalDiscount, subtotal);
  }

  /**
   * Calculate the overpayment amount from exchange tickets
   * Returns the change that should be returned as a new exchange ticket (RN0036)
   */
  public getExchangeTicketsOverpayment(): number {
    if (!this.tickets || this.tickets.length === 0) return 0;

    const subtotal = this.getSubtotal();

    // 1. Apply promotional discount first
    const promotional = this.getPromotionalTicket();
    let remainingAmount = subtotal;
    if (promotional) {
      remainingAmount -= promotional.applyTicket(subtotal);
    }

    // 2. Calculate total value of exchange tickets used
    const exchangeTickets = this.getExchangeTickets();
    const totalExchangeValue = exchangeTickets.reduce(
      (sum, ticket) => sum + ticket.value,
      0,
    );

    // 3. Calculate overpayment (change to be returned)
    if (totalExchangeValue > remainingAmount) {
      return totalExchangeValue - remainingAmount;
    }

    return 0;
  }

  public getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  public getFinalPrice(): number {
    const totalItemsPrice = this.getSubtotal();
    const result = totalItemsPrice - this.getDiscount();

    return result > 0 ? result : 0;
  }

  public getSubtotal(): number {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  public getDiscount(): number {
    return this.getTotalTicketsDiscount();
  }

  public addItem(item: OrderItem): void {
    const existingItem = this.items.find((i) => i.equals(item));
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
  }

  public removeItem(item: OrderItem): void {
    this._items = this.items.filter((i) => !i.equals(item));
  }

  public getSuccessfulPayments(): Payment[] {
    return this.payments.filter((p) => p.status === PaymentStatus.SUCCEEDED);
  }

  public getTotalPaid(): number {
    return this.getSuccessfulPayments().reduce((sum, p) => sum + p.amount, 0);
  }

  public isFullyPaid(): boolean {
    return this.getTotalPaid() >= this.getFinalPrice();
  }

  public getRemainingBalance(): number {
    return Math.max(0, this.getFinalPrice() - this.getTotalPaid());
  }

  public getPaymentsByCard(cardId: string): Payment[] {
    return this.payments.filter((p) => p.card?.id === cardId);
  }

  public getPendingPayments(): Payment[] {
    return this.payments.filter(
      (p) =>
        p.status === PaymentStatus.PENDING ||
        p.status === PaymentStatus.PROCESSING,
    );
  }

  public canBeCancelled(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  public cancel(): void {
    if (!this.canBeCancelled()) {
      throw new Error('Order cannot be cancelled in its current status.');
    }
    this.status = OrderStatus.CANCELLED;
  }

  public canBeRefunded(): boolean {
    const deliveredDate = this.statusHistory.find(
      (change) => change.current === OrderStatus.DELIVERED,
    )?.at;

    if (!deliveredDate) return false;

    const now = new Date();
    const diffInMs = now.getTime() - deliveredDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays <= Order.MAX_PERIOD_TO_REFUND_IN_DAYS;
  }

  public isTherePendingRefunds(): boolean {
    if (!this.refunds) return false;

    return this.refunds.some(
      (refund) =>
        refund.status !== RefundStatus.COMPLETED &&
        refund.status !== RefundStatus.REJECTED,
    );
  }

  public getRefundableItems(): OrderItem[] {
    if (!this.canBeRefunded()) return [];

    const refundedQuantities = this.getRefundedQuantitiesByItem();

    return this.items.filter((item) => {
      const refundedQty = refundedQuantities.get(item.bookId) || 0;
      return item.quantity > refundedQty;
    });
  }

  public getRefundedQuantitiesByItem(): Map<string, number> {
    const refundedQuantities = new Map<string, number>();

    if (!this.refunds) return refundedQuantities;

    const completedRefunds = this.refunds.filter(
      (refund) => refund.status === RefundStatus.COMPLETED,
    );

    for (const refund of completedRefunds) {
      for (const refundItem of refund.items) {
        const currentQty =
          refundedQuantities.get(refundItem.orderItem.bookId) || 0;
        refundedQuantities.set(
          refundItem.orderItem.bookId,
          currentQty + refundItem.quantity,
        );
      }
    }

    return refundedQuantities;
  }

  public getTotalRefunded(): number {
    if (!this.refunds) return 0;

    return this.refunds
      .filter((refund) => refund.status === RefundStatus.COMPLETED)
      .reduce((sum, refund) => sum + refund.getTotalAmount(), 0);
  }

  public hasPendingRefunds(): boolean {
    if (!this.refunds) return false;

    return this.refunds.some(
      (refund) =>
        refund.status === RefundStatus.REQUESTED ||
        refund.status === RefundStatus.APPROVED,
    );
  }
}

export class OrderStatusChange {
  previous: OrderStatus;
  current: OrderStatus;
  at: Date;

  constructor(previous: OrderStatus, current: OrderStatus) {
    this.previous = previous;
    this.current = current;
    this.at = new Date();
  }
}
