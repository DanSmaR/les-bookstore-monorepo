import { Book } from '@/domain/book.entity';

import { BaseRepository } from '../base.repository';

export interface BooksRepository extends BaseRepository<Book> {
  findByAuthor(author: string): Promise<Book[]>;
  findByTitle(title: string): Promise<Book[]>;
  findByISBN(isbn: string): Promise<Book | null>;
}
