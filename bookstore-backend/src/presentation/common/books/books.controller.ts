import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { RolesGuard } from '@/infrastructure/auth/guards';
import { JwtAuthGuard } from '@/infrastructure/auth/guards/jwt-auth.guard';
import { PaginatedResultDTO } from '@/presentation/dtos/paginated-result.dto';
import { PaginationParamsDTO } from '@/presentation/dtos/pagination-params.dto';

import { BooksWebService } from './books.webservice';
import { BookDTO } from './dtos/book.dto';
import { CreateBookDTO } from './dtos/create-book.dto';
import { MinBookDTO } from './dtos/min-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly webService: BooksWebService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  public async create(@Body() body: CreateBookDTO): Promise<BookDTO> {
    return this.webService.newBook(body);
  }

  @Get()
  public async findAll(
    @Query() query: PaginationParamsDTO,
    @Query() filters: Record<string, any> = {},
  ): Promise<PaginatedResultDTO<MinBookDTO>> {
    return this.webService.findAll(query, filters);
  }

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<BookDTO> {
    return this.webService.findById(id);
  }
}
