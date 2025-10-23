import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from '@/application/orders/services/orders.service';
import { CancelOrder } from '@/application/orders/use-cases/cancel-order.usecase';
import { CreateNewOrder } from '@/application/orders/use-cases/create-new-order.usecase';
import { PayOrder } from '@/application/orders/use-cases/pay-order.usecase';
import { Order } from '@/domain/order/order.entity';
import { OrderItem } from '@/domain/order/order-item.entity';
import { Payment } from '@/domain/order/payment/payment.entity';
import { MockPaymentGateway } from '@/infrastructure/payment/mock/mock-payment.gateway';
import { OrdersRepositoryImpl } from '@/infrastructure/persistence/typeorm/repositories';
import { OrdersController } from '@/presentation/site/orders/orders.controller';
import { OrdersWebService } from '@/presentation/site/orders/orders.webservice';

import { BooksModule } from './books.module';
import { UsersModule } from './users.module';

const USE_CASES = [CreateNewOrder, PayOrder, CancelOrder];

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Payment]),
    BooksModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [
    {
      provide: 'OrdersRepository',
      useClass: OrdersRepositoryImpl,
    },
    {
      provide: 'PaymentGateway',
      useClass: MockPaymentGateway,
    },
    OrdersWebService,
    OrdersService,
    ...USE_CASES,
  ],
})
export class OrdersModule {}
