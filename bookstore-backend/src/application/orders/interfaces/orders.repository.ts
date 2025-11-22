import { Book } from '@/domain/book.entity';
import { Order } from '@/domain/order/order.entity';

import { BaseRepository } from '../../base.repository';

export interface OrdersRepository extends BaseRepository<Order> {
  findByIdAndUserId(id: string, userId: string): Promise<Order | null>;
  findLastBoughtBooksByUser(userId: string, limit: number): Promise<Book[]>;
}
