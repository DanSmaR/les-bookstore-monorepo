import { Book } from '@/domain/book.entity';

export class OrderBookDTO {
  id: string;
  title: string;
  author: string;
  price: number;
  isbn: string;

  constructor(book: Book) {
    this.id = book.id;
    this.title = book.title;
    this.author = book.author;
    this.price = book.price;
    this.isbn = book.isbn;
  }
}
