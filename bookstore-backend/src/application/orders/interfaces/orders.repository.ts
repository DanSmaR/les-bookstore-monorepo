import { Order } from '@/domain/order/order.entity';
import { OrderStatus } from '@/domain/order/status.enum';
import { User } from '@/domain/user/user.entity';

import { BaseRepository } from '../../base.repository';

export interface OrdersRepository extends BaseRepository<Order> {
  findByUserAndStatus(customer: User, status?: OrderStatus): Promise<Order[]>;
}
