import { HttpStatus } from '@nestjs/common';

import { CustomException } from '@/application/exceptions';

export class IsbnNotFoundException extends CustomException {
  constructor(isbn: string) {
    super(`Book with ISBN ${isbn} not found`, HttpStatus.NOT_FOUND);
  }
}
