import { Book } from '@/domain/book.entity';

export class MinBookDTO {
  id: string;
  title: string;
  author: string;
  isbn: string;
  price: number;
  stock: number;
  publisher?: string;
  imageUrl?: string;

  constructor(entity: Book) {
    this.id = entity.id;
    this.title = entity.title;
    this.author = entity.author;
    this.isbn = entity.isbn;
    this.price = entity.price;
    this.stock = entity.stock;
    this.publisher = entity.publisher;
  }
}
