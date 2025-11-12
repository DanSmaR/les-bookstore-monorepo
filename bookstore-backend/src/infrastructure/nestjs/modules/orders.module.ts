import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from '@/application/orders/services/orders.service';
import { TicketsService } from '@/application/orders/services/tickets.service';
import { ApplyTicketsToOrder } from '@/application/orders/use-cases/apply-tickets-to-order.usecase';
import { CancelOrder } from '@/application/orders/use-cases/cancel-order.usecase';
import { ChangeOrderStatus } from '@/application/orders/use-cases/change-order-status/change-order-status.usecase';
import { CancelOrderHandler } from '@/application/orders/use-cases/change-order-status/handlers/cancel-order.handler';
import { CreateNewOrder } from '@/application/orders/use-cases/create-new-order.usecase';
import { GenerateExchangeTicket } from '@/application/orders/use-cases/generate-exchange-ticket.use-case';
import { PayOrder } from '@/application/orders/use-cases/pay-order.usecase';
import { ChangeRefundStatus } from '@/application/orders/use-cases/refund/change-refund-status/change-refund-status.usecase';
import { CompletedRefundHandler } from '@/application/orders/use-cases/refund/change-refund-status/handlers/completed-refund.handler';
import { RefundOrderItems } from '@/application/orders/use-cases/refund/refund-order-items.usecase';
import { ValidateTicket } from '@/application/orders/use-cases/tickets/validate-ticket.usecase';
import { Order } from '@/domain/order/order.entity';
import { OrderItem } from '@/domain/order/order-item.entity';
import { Payment } from '@/domain/order/payment/payment.entity';
import { Refund } from '@/domain/order/refund.entity';
import { RefundItem } from '@/domain/order/refund-item.entity';
import { Ticket } from '@/domain/ticket/ticket.entity';
import { MockPaymentGateway } from '@/infrastructure/payment/mock/mock-payment.gateway';
import {
  OrdersRepositoryImpl,
  TicketsRepositoryImpl,
} from '@/infrastructure/persistence/typeorm/repositories';
import { OrderTicketsController } from '@/presentation/site/orders/order-tickets.controller';
import { OrdersSiteController } from '@/presentation/site/orders/orders-site.controller';
import { OrdersSiteWebService } from '@/presentation/site/orders/orders-site.webservice';
import { TicketsSiteController } from '@/presentation/site/tickets/tickets-site.controller';
import { TicketsSiteWebService } from '@/presentation/site/tickets/tickets-site.webservice';

import { BooksModule } from './books.module';
import { UsersModule } from './users.module';

const CONTROLLERS = [
  OrdersSiteController,
  TicketsSiteController,
  OrderTicketsController,
];
const WEB_SERVICES = [OrdersSiteWebService, TicketsSiteWebService];
const USE_CASES = [
  CreateNewOrder,
  PayOrder,
  CancelOrder,
  ValidateTicket,
  ApplyTicketsToOrder,
  GenerateExchangeTicket,
  ChangeOrderStatus,
  ChangeRefundStatus,
  RefundOrderItems,
];
const BUSINESS_SERVICES = [TicketsService, OrdersService];

const CHANGE_STATUS_HANDLERS = [CancelOrderHandler];
const REFUND_STATUS_HANDLERS = [CompletedRefundHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Payment,
      Ticket,
      Refund,
      RefundItem,
    ]),
    BooksModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [...CONTROLLERS],
  providers: [
    ...WEB_SERVICES,
    ...USE_CASES,
    ...BUSINESS_SERVICES,
    ...CHANGE_STATUS_HANDLERS,
    ...REFUND_STATUS_HANDLERS,
    {
      provide: 'OrderStatusChangeHandlers',
      useFactory: (...handlers: typeof CHANGE_STATUS_HANDLERS) => handlers,
      inject: [...CHANGE_STATUS_HANDLERS],
    },
    {
      provide: 'RefundStatusChangeHandlers',
      useFactory: (...handlers: typeof REFUND_STATUS_HANDLERS) => handlers,
      inject: [...REFUND_STATUS_HANDLERS],
    },
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
  exports: [
    ...BUSINESS_SERVICES,
    ChangeRefundStatus,
    ChangeOrderStatus,
    RefundOrderItems,
  ],
})
export class OrdersModule {}
