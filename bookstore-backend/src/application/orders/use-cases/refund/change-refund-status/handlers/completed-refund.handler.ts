import { Injectable } from '@nestjs/common';

import { BooksService } from '@/application/books/services/books.service';
import { RefundStatus } from '@/domain/order/enums/refund-status.enum';
import { Order } from '@/domain/order/order.entity';
import { Refund } from '@/domain/order/refund.entity';

import { GenerateExchangeTicket } from '../../../generate-exchange-ticket.use-case';
import { RefundStatusChangeHandler } from '../refund-status-change-handler.interface';

@Injectable()
export class CompletedRefundHandler implements RefundStatusChangeHandler {
  constructor(
    private readonly generateExchangeTicket: GenerateExchangeTicket,
    private readonly booksService: BooksService,
  ) {}

  public async handle(
    refund: Refund,
    userId: string,
    order: Order,
  ): Promise<Refund> {
    await this.generateExchangeTicket.execute({
      userId,
      originOrderId: order.id,
      amount: refund.getTotalAmount(),
      reason: 'product_return',
    });

    for (const item of refund.items) {
      item.orderItem.book.increaseStock(item.quantity);
    }
    await this.booksService.saveAll(
      refund.items.map((item) => item.orderItem.book),
    );

    refund.completedAt = new Date();

    return refund;
  }

  public getStatus(): RefundStatus {
    return RefundStatus.COMPLETED;
  }
}
