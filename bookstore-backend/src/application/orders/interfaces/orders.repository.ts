import { Order } from '@/domain/order/order.entity';

import { BaseRepository } from '../../base.repository';

export interface OrdersRepository extends BaseRepository<Order> {}
