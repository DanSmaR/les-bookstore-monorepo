import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/nestjs/modules/auth.module';
import { BooksModule } from './infrastructure/nestjs/modules/books.module';
import { DatabaseModule } from './infrastructure/nestjs/modules/database.module';
import { OrdersModule } from './infrastructure/nestjs/modules/orders.module';
import { UsersModule } from './infrastructure/nestjs/modules/users.module';
import { TestModule } from './presentation/test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? path.resolve(process.cwd(), '.env.test')
          : path.resolve(process.cwd(), '.env'),
    }),
    DatabaseModule,
    TestModule,
    AuthModule,
    UsersModule,
    BooksModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
