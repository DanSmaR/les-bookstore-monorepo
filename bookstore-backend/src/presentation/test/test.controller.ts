import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

import { Book } from '@/domain/book.entity';
import { Order } from '@/domain/order/order.entity';
import { OrderItem } from '@/domain/order/order-item.entity';
import { TicketNature } from '@/domain/ticket/enums/ticket-nature.enum';
import { TicketStatus } from '@/domain/ticket/enums/ticket-status.enum';
import { TicketType } from '@/domain/ticket/enums/ticket-type.enum';
import { Ticket } from '@/domain/ticket/ticket.entity';
import { Address } from '@/domain/user/address.entity';
import { Gender } from '@/domain/user/enums/gender.enum';
import { UserRole } from '@/domain/user/enums/role.enum';
import { User } from '@/domain/user/user.entity';

@Controller('test')
export class TestController {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  health() {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    return {
      status: 'ok',
      environment: nodeEnv,
      timestamp: new Date().toISOString(),
      database: {
        connected: this.dataSource.isInitialized,
        name: this.configService.get<string>('DATABASE_NAME'),
      },
    };
  }

  @Post('reset-database')
  @HttpCode(HttpStatus.OK)
  async resetDatabase() {
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    // Only allow in test environment
    if (nodeEnv !== 'test') {
      return {
        success: false,
        error: 'Database reset only allowed in test environment',
        environment: nodeEnv,
      };
    }

    try {
      // Ensure database is connected
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      // Get all entities
      const entities = this.dataSource.entityMetadatas;

      // Disable foreign key checks for PostgreSQL
      await this.dataSource.query('SET session_replication_role = replica;');

      // Clear all tables in reverse order to handle dependencies
      const tableNames = entities.map((entity) => entity.tableName);

      for (const tableName of tableNames.reverse()) {
        try {
          await this.dataSource.query(`TRUNCATE TABLE "${tableName}" CASCADE;`);
        } catch (error) {
          console.warn(
            `Warning: Could not truncate table ${tableName}:`,
            error instanceof Error ? error.message : String(error),
          );
        }
      }

      // Re-enable foreign key checks
      await this.dataSource.query('SET session_replication_role = DEFAULT;');

      // Reset sequences for auto-increment fields
      for (const entity of entities) {
        const tableName = entity.tableName;
        try {
          await this.dataSource.query(
            `ALTER SEQUENCE IF EXISTS "${tableName}_id_seq" RESTART WITH 1;`,
          );
        } catch (error) {
          console.warn(
            `Warning: Could not reset sequence for ${tableName}:`,
            error instanceof Error ? error.message : String(error),
          );
        }
      }

      return {
        success: true,
        message: 'Database reset successfully',
        tablesCleared: tableNames.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Database reset error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('seed-test-data')
  @HttpCode(HttpStatus.OK)
  seedTestData() {
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    if (nodeEnv !== 'test') {
      return {
        success: false,
        error: 'Test data seeding only allowed in test environment',
      };
    }

    try {
      // Add any test data seeding logic here if needed
      return {
        success: true,
        message: 'Test data seeded successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to seed test data',
      };
    }
  }

  @Post('create-admin-user')
  @HttpCode(HttpStatus.CREATED)
  async createAdminUser(
    @Body()
    body: {
      name: string;
      email: string;
      cpf: string;
      phone: string;
      password: string;
      gender: string;
      birthDate: string;
      address?: Record<string, unknown>;
    },
  ) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    if (nodeEnv !== 'test') {
      return {
        success: false,
        error: 'Admin user creation only allowed in test environment',
      };
    }

    try {
      // Ensure database is connected
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);

      // Map gender string to enum
      const genderMap: Record<string, Gender> = {
        male: Gender.MALE,
        female: Gender.FEMALE,
        other: Gender.OTHER,
      };

      // Create user entity
      const user = new User({
        name: body.name,
        email: body.email,
        cpf: body.cpf,
        phone: body.phone,
        password: hashedPassword,
        gender: genderMap[body.gender] || Gender.OTHER,
        birthDate: new Date(body.birthDate),
      });

      // Set role to ADMIN
      user.role = UserRole.ADMIN;

      // Add address if provided
      if (body.address) {
        const address = new Address(body.address as any);
        user.customerDetails.addresses.push(address);
      }

      // Save user
      const userRepository = this.dataSource.getRepository(User);
      const savedUser = await userRepository.save(user);

      return {
        success: true,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          name: savedUser.name,
          role: savedUser.role,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Admin user creation error:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create admin user',
      };
    }
  }

  @Post('create-book')
  @HttpCode(HttpStatus.CREATED)
  async createBook(
    @Body()
    body: {
      title: string;
      author: string;
      publisher?: string;
      isbn: string;
      price: number;
      stock: number;
      active?: boolean;
      description?: string;
      publishedDate?: string;
    },
  ) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    if (nodeEnv !== 'test') {
      return {
        success: false,
        error: 'Book creation only allowed in test environment',
      };
    }

    try {
      // Ensure database is connected
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      // Create book entity
      const book = new Book({
        title: body.title,
        author: body.author,
        isbn: body.isbn,
        price: body.price,
        stock: body.stock,
        publisher: body.publisher,
        description: body.description,
        publishedDate: body.publishedDate
          ? new Date(body.publishedDate)
          : undefined,
      });

      // Save book
      const bookRepository = this.dataSource.getRepository(Book);
      const savedBook = await bookRepository.save(book);

      return savedBook;
    } catch (error) {
      console.error('Book creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create book',
      };
    }
  }

  @Post('create-ticket')
  @HttpCode(HttpStatus.CREATED)
  async createTicket(
    @Body()
    body: {
      code: string;
      value: number;
      type: 'percentage' | 'raw';
      nature: 'promotional' | 'exchange';
      ownerId?: string;
      validUntil?: string;
      description?: string;
      maxDiscount?: number;
      originOrderId?: string;
      status?: 'active' | 'used' | 'expired';
    },
  ) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    if (nodeEnv !== 'test') {
      return {
        success: false,
        error: 'Ticket creation only allowed in test environment',
      };
    }

    try {
      // Ensure database is connected
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      // Map string types to enums
      const ticketType =
        body.type === 'percentage' ? TicketType.PERCENTAGE : TicketType.RAW;
      const ticketNature =
        body.nature === 'promotional'
          ? TicketNature.PROMOTIONAL
          : TicketNature.EXCHANGE;
      // Default to ACTIVE if status is not provided
      const ticketStatus =
        body.status === 'active'
          ? TicketStatus.ACTIVE
          : body.status === 'used'
            ? TicketStatus.USED
            : body.status === 'expired'
              ? TicketStatus.EXPIRED
              : TicketStatus.ACTIVE;

      // Create ticket entity
      // Only set ownerId if it's explicitly provided (not undefined/null)
      // This ensures exchange tickets get the correct ownerId
      const ticketProps: any = {
        code: body.code,
        value: body.value,
        type: ticketType,
        nature: ticketNature,
        validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
        description: body.description,
        maxDiscount: body.maxDiscount,
        originOrderId: body.originOrderId,
        status: ticketStatus,
      };

      // Explicitly set ownerId only if provided
      if (body.ownerId !== undefined && body.ownerId !== null) {
        ticketProps.ownerId = body.ownerId;
      }

      const ticket = new Ticket(ticketProps);

      console.log(
        `[createTicket] Creating ticket: ${body.code}, nature: ${ticketNature}, ownerId from body: ${body.ownerId}, ownerId type: ${typeof body.ownerId}, ownerId === undefined: ${body.ownerId === undefined}, ownerId === null: ${body.ownerId === null}, status: ${ticketStatus}`,
      );

      // Save ticket
      const ticketRepository = this.dataSource.getRepository(Ticket);
      const savedTicket = await ticketRepository.save(ticket);

      console.log(
        `[createTicket] Saved ticket: ${savedTicket.code}, ownerId: ${savedTicket.ownerId}, nature: ${savedTicket.nature}`,
      );

      return {
        success: true,
        ticket: {
          id: savedTicket.id,
          code: savedTicket.code,
          value: savedTicket.value,
          type: savedTicket.type,
          nature: savedTicket.nature,
          ownerId: savedTicket.ownerId,
        },
      };
    } catch (error) {
      console.error('Ticket creation error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create ticket',
      };
    }
  }

  @Post('create-order')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body()
    body: {
      userId: string;
      bookId: string;
      quantity?: number;
    },
  ) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    if (nodeEnv !== 'test') {
      return {
        success: false,
        error: 'Order creation only allowed in test environment',
      };
    }

    try {
      // Ensure database is connected
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      const userRepository = this.dataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: body.userId },
        relations: ['customerDetails', 'customerDetails._addresses'],
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      if (!user.customerDetails) {
        return {
          success: false,
          error: 'User has no customer details',
        };
      }

      // Use the getter which handles the underscore prefix
      const addresses = user.customerDetails.addresses;
      if (addresses.length === 0) {
        return {
          success: false,
          error: 'User has no addresses',
        };
      }

      const address = addresses[0];

      const bookRepository = this.dataSource.getRepository(Book);
      const book = await bookRepository.findOne({
        where: { id: body.bookId },
      });

      if (!book) {
        return {
          success: false,
          error: 'Book not found',
        };
      }

      // Create order using static imports (no dynamic import needed)
      const order = new Order({
        customer: user.customerDetails,
        deliveryAddress: address,
      });

      // Add order item
      const quantity = body.quantity || 1;
      order.addItem(
        new OrderItem({
          book,
          quantity,
        }),
      );

      // Save order
      const orderRepository = this.dataSource.getRepository(Order);
      const savedOrder = await orderRepository.save(order);

      return {
        success: true,
        order: {
          id: savedOrder.id,
          userId: user.id,
          finalPrice: savedOrder.getFinalPrice(),
        },
      };
    } catch (error) {
      console.error('Order creation error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create order',
      };
    }
  }
}
