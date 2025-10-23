import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Book } from '../book.entity';
import { DecimalColumn } from '../decorators/decimal-column.decorator';
import { Order } from './order.entity';

@Entity('tb_order_items')
export class OrderItem {
  @PrimaryColumn()
  orderId: string;

  @PrimaryColumn()
  bookId: string;

  @ManyToOne(() => Book, { eager: true })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  quantity: number;

  @DecimalColumn({ precision: 10, scale: 2 })
  unitPrice: number;

  constructor(props: { book: Book; quantity: number }) {
    if (props) {
      this.book = props.book;
      this.quantity = props.quantity;
      this.unitPrice = props.book.price;
    }
  }

  public getTotalPrice(): number {
    return this.unitPrice * this.quantity;
  }

  public equals(other: OrderItem): boolean {
    return this.book.equals(other.book) && this.order.equals(other.order);
  }
}
