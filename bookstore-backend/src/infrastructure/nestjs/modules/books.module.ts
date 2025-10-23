import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BooksService } from '@/application/books/services/books.service';
import { CreateBook } from '@/application/books/use-cases/create-book.usecase';
import { Book } from '@/domain/book.entity';
import { BooksRepositoryImpl } from '@/infrastructure/persistence/typeorm/repositories/books.repository';
import { BooksController } from '@/presentation/common/books/books.controller';
import { BooksWebService } from '@/presentation/common/books/books.webservice';

const USE_CASES = [CreateBook];

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [
    {
      provide: 'BooksRepository',
      useClass: BooksRepositoryImpl,
    },
    BooksService,
    BooksWebService,
    ...USE_CASES,
  ],
  exports: [BooksService],
})
export class BooksModule {}
