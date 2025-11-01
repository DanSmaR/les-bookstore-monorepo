import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from '@/application/orders/services/orders.service';
import { TicketsService } from '@/application/orders/services/tickets.service';
import { ApplyTicketsToOrder } from '@/application/orders/use-cases/apply-tickets-to-order.use-case';
import { CancelOrder } from '@/application/orders/use-cases/cancel-order.usecase';
import { CreateNewOrder } from '@/application/orders/use-cases/create-new-order.usecase';
import { GenerateExchangeTicket } from '@/application/orders/use-cases/generate-exchange-ticket.use-case';
import { PayOrder } from '@/application/orders/use-cases/pay-order.usecase';
import { ValidateTicket } from '@/application/orders/use-cases/tickets/validate-ticket.usecase';
import { Order } from '@/domain/order/order.entity';
import { OrderItem } from '@/domain/order/order-item.entity';
import { Payment } from '@/domain/order/payment/payment.entity';
import { Ticket } from '@/domain/ticket/ticket.entity';
import { MockPaymentGateway } from '@/infrastructure/payment/mock/mock-payment.gateway';
import {
  OrdersRepositoryImpl,
  TicketsRepositoryImpl,
} from '@/infrastructure/persistence/typeorm/repositories';
import { OrderTicketsController } from '@/presentation/site/orders/order-tickets.controller';
import { OrdersController } from '@/presentation/site/orders/orders.controller';
import { OrdersWebService } from '@/presentation/site/orders/orders.webservice';
import { TicketsSiteController } from '@/presentation/site/tickets/tickets-site.controller';
import { TicketsSiteWebService } from '@/presentation/site/tickets/tickets-site.webservice';

import { BooksModule } from './books.module';
import { UsersModule } from './users.module';

const CONTROLLERS = [
  OrdersController,
  TicketsSiteController,
  OrderTicketsController,
];
const WEB_SERVICES = [OrdersWebService, TicketsSiteWebService];
const USE_CASES = [
  CreateNewOrder,
  PayOrder,
  CancelOrder,
  ValidateTicket,
  ApplyTicketsToOrder,
  GenerateExchangeTicket,
];
const BUSINESS_SERVICES = [TicketsService, OrdersService];

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Payment, Ticket]),
    BooksModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [...CONTROLLERS],
  providers: [
    ...WEB_SERVICES,
    ...USE_CASES,
    ...BUSINESS_SERVICES,
    {
      provide: 'OrdersRepository',
      useClass: OrdersRepositoryImpl,
    },
    {
      provide: 'TicketsRepository',
      useClass: TicketsRepositoryImpl,
    },
    {
      provide: 'PaymentGateway',
      useClass: MockPaymentGateway,
    },
  ],
  exports: [TicketsService],
})
export class OrdersModule {}
