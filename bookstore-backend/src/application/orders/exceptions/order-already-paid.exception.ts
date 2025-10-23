import { HttpStatus } from '@nestjs/common';

import { CustomException } from '@/application/exceptions/custom.exception';

export class OrderAlreadyFullyPaidException extends CustomException {
  constructor(orderId: string) {
    super(
      `Order with ID ${orderId} is already fully paid.`,
      HttpStatus.ACCEPTED,
    );
  }
}
