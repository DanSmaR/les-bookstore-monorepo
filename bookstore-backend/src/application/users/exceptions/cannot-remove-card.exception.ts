import { HttpStatus } from '@nestjs/common';

import { CustomException } from '@/application/exceptions';

export class CannotRemoveCardException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
