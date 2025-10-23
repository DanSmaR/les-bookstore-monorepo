import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BooksRepository } from '@/application/books/books.repository';
import { Book } from '@/domain/book.entity';

import { CRUDRepository } from './base.repository';

@Injectable()
export class BooksRepositoryImpl
  extends CRUDRepository<Book>
  implements BooksRepository
{
  constructor(@InjectRepository(Book) repository: Repository<Book>) {
    super(repository);
  }

  findByAuthor(author: string): Promise<Book[]> {
    return this.repository.findBy({ author });
  }
  findByTitle(title: string): Promise<Book[]> {
    return this.repository.findBy({ title });
  }
  findByISBN(isbn: string): Promise<Book | null> {
    return this.repository.findOneBy({ isbn });
  }
}
