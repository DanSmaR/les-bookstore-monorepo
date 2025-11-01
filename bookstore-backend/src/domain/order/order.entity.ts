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
import { OrderItem } from './order-item.entity';
import { PaymentStatus } from './payment/enums/payment-status.enum';
import { Payment } from './payment/payment.entity';
import { OrderStatus } from './status.enum';

@Entity('tb_orders')
export class Order extends DomainEntity {
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    eager: true,
    cascade: true,
  })
  _items: OrderItem[];

  @Column()
  orderDate: Date = new Date();

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus = OrderStatus.PENDING;

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
  tickets: Ticket[];

  @ManyToOne(() => CustomerDetails, (customer) => customer.orders)
  @JoinColumn()
  customer: CustomerDetails;

  constructor(props: {
    customer: CustomerDetails;
    deliveryAddress: Address;
    tickets?: Ticket[];
  }) {
    super();
    if (props) {
      this.customer = props.customer;
      this.deliveryAddress = props.deliveryAddress;
      this.tickets = props.tickets || [];
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
}
