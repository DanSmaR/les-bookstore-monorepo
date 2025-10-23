import { Inject, Injectable } from '@nestjs/common';

import { BaseService } from '@/application/base.service';
import { Book } from '@/domain/book.entity';

import { BooksRepository } from '../books.repository';
import { IsbnNotFoundException } from '../exceptions/isbn-notfound.exception';

@Injectable()
export class BooksService extends BaseService<Book> {
  constructor(
    @Inject('BooksRepository')
    private readonly repository: BooksRepository,
  ) {
    super(repository);
  }

  public async findByTitle(title: string): Promise<Book[]> {
    return this.repository.findByTitle(title);
  }

  public async findByAuthor(author: string): Promise<Book[]> {
    return this.repository.findByAuthor(author);
  }

  public async findByIsbn(isbn: string): Promise<Book | null> {
    return this.repository.findByISBN(isbn);
  }

  public async findByIsbnOrThrow(isbn: string): Promise<Book> {
    const book = await this.findByIsbn(isbn);
    if (!book) {
      throw new IsbnNotFoundException(isbn);
    }
    return book;
  }
}
