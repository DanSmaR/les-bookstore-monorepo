import { DomainEntity } from '@domain/domain.entity';
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Order } from '../order/order.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Address } from './address.entity';
import { Card } from './card.entity';
import { User } from './user.entity';

@Entity('tb_customer_details')
export class CustomerDetails extends DomainEntity {
  @OneToOne(() => User, (user) => user.customerDetails)
  @JoinColumn()
  user: User;

  @OneToMany(() => Address, (address) => address.customerDetails, {
    cascade: true,
    eager: true,
  })
  _addresses: Address[];

  @OneToMany(() => Card, (card) => card.customerDetails, {
    cascade: true,
    eager: true,
  })
  _cards: Card[];

  @OneToMany(() => Order, (order) => order.customer, {
    cascade: true,
    lazy: true,
  })
  _orders: Promise<Order[]>;

  @ManyToMany(() => Ticket, { eager: true })
  @JoinTable({
    name: 'tb_used_tickets',
    joinColumn: { name: 'customer_details_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ticket_id', referencedColumnName: 'id' },
  })
  _usedTickets: Ticket[];

  // Collection getters to ensure arrays are always initialized ============

  get addresses(): Address[] {
    if (!this._addresses) {
      this._addresses = [];
    }
    return this._addresses;
  }

  get cards(): Card[] {
    if (!this._cards) {
      this._cards = [];
    }
    return this._cards;
  }

  get orders(): Promise<Order[]> {
    return this._orders.then((orders) => orders || []);
  }

  get usedTickets(): Ticket[] {
    if (!this._usedTickets) {
      this._usedTickets = [];
    }
    return this._usedTickets;
  }

  // Business logic methods ================================================

  public hasAddress(address: Address): boolean;
  public hasAddress(addressId: string): boolean;

  public hasAddress(address: Address | string): boolean {
    if (typeof address === 'string') {
      return this.addresses.some((a) => a.id === address);
    }
    return this.addresses.some((a) => a.equals(address));
  }

  public getAddress(addressId: string): Address | undefined {
    return this.addresses.find((a) => a.id === addressId);
  }

  public hasCard(card: Card): boolean;
  public hasCard(cardNumber: string): boolean;

  public hasCard(card: Card | string): boolean {
    if (typeof card === 'string') {
      return this.cards.some((c) => c.number === card);
    }
    return this.cards.some((c) => c.equals(card));
  }

  public getCard(identifier: string): Card | undefined {
    return this.cards.find(
      (c) => c.number === identifier || c.id === identifier,
    );
  }

  public async getMostRecentOrder(): Promise<Order | undefined> {
    const orders = await this.orders;
    if (!orders || orders.length === 0) {
      return undefined;
    }

    return orders.reduce((mostRecent, current) => {
      if (!mostRecent) return current;

      return current.orderDate > mostRecent.orderDate ? current : mostRecent;
    });
  }

  public async getRecentOrders(count: number): Promise<Order[]> {
    const orders = await this.orders;
    return orders
      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())
      .slice(0, count);
  }

  public hasUsedTicket(ticket: Ticket): boolean;
  public hasUsedTicket(ticketId: string): boolean;

  public hasUsedTicket(ticket: Ticket | string): boolean {
    if (typeof ticket === 'string') {
      return this.usedTickets.some((t) => t.id === ticket);
    }
    return this.usedTickets.some((t) => t.equals(ticket));
  }

  public addUsedTicket(ticket: Ticket): void {
    if (!this.hasUsedTicket(ticket)) {
      this._usedTickets.push(ticket);
    }
  }

  public reinstateTicket(ticket: Ticket): void {
    this._usedTickets = this.usedTickets.filter((t) => !t.equals(ticket));
  }
}
