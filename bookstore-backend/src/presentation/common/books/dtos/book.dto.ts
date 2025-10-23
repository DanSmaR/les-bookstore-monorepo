import { Book } from '@/domain/book.entity';

export class BookDTO {
  title: string;
  author: string;
  isbn: string;
  description?: string;
  price: number;
  stock: number;
  publisher?: string;
  publishedDate?: Date;

  constructor(book: Book) {
    this.title = book.title;
    this.author = book.author;
    this.isbn = book.isbn;
    this.description = book.description;
    this.price = book.price;
    this.stock = book.stock;
    this.publisher = book.publisher;
    this.publishedDate = book.publishedDate;
  }
}
