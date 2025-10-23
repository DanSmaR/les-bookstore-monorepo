import { Column, Entity } from 'typeorm';

import { DecimalColumn } from './decorators/decimal-column.decorator';
import { DomainEntity } from './domain.entity';

@Entity('tb_books')
export class Book extends DomainEntity {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ length: 13, unique: true })
  isbn: string;

  @Column('text', { nullable: true })
  description?: string;

  @DecimalColumn({ precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ length: 100, nullable: true })
  publisher?: string;

  @Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  constructor(props: {
    title: string;
    author: string;
    isbn: string;
    description?: string;
    price: number;
    stock: number;
    publisher?: string;
    publishedDate?: Date;
  }) {
    super();
    if (props) {
      this.title = props.title;
      this.author = props.author;
      this.isbn = this.cleanISBN(props.isbn);
      this.description = props.description;
      this.price = props.price;
      this.stock = props.stock;
      this.publisher = props.publisher;
      this.publishedDate = props.publishedDate;
    }
  }

  public update(props: {
    title: string;
    author: string;
    description?: string;
    price: number;
    stock: number;
    publisher?: string;
    publishedDate?: Date;
  }): void {
    this.title = props.title;
    this.author = props.author;
    this.description = props.description;
    this.price = props.price;
    this.stock = props.stock;
    this.publisher = props.publisher;
    this.publishedDate = props.publishedDate;
  }

  private cleanISBN(isbn: string): string {
    return isbn.replace(/[^\dX]/gi, '');
  }

  public getFormattedISBN(): string {
    if (this.isbn.length === 10) {
      return `${this.isbn.slice(0, 1)}-${this.isbn.slice(1, 4)}-${this.isbn.slice(4, 9)}-${this.isbn.slice(9)}`;
    } else if (this.isbn.length === 13) {
      return `${this.isbn.slice(0, 3)}-${this.isbn.slice(3, 4)}-${this.isbn.slice(4, 7)}-${this.isbn.slice(7, 12)}-${this.isbn.slice(12)}`;
    }
    return this.isbn;
  }

  public isInStock(quantity: number): boolean {
    return this.stock >= quantity;
  }

  public reduceStock(quantity: number): void {
    if (!this.isInStock(quantity)) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
  }

  public increaseStock(quantity: number): void {
    this.stock += quantity;
  }
}
