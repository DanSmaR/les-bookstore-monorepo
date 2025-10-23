import { ConflictException, Injectable } from '@nestjs/common';

import { Book } from '@/domain/book.entity';
import { CreateBookDTO } from '@/presentation/common/books/dtos/create-book.dto';

import { BooksService } from '../services/books.service';

@Injectable()
export class CreateBook {
  constructor(private readonly service: BooksService) {}

  public async execute(dto: CreateBookDTO): Promise<Book> {
    if (await this.service.findByIsbn(dto.isbn)) {
      throw new ConflictException('A book with this ISBN already exists.');
    }

    return await this.service.save(new Book(dto));
  }
}
