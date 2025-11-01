import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource } from 'typeorm-transactional';

export const ORMS = {
  typeorm: () =>
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV');
        const isTest = nodeEnv === 'test';

        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: parseInt(configService.get('DATABASE_PORT'), 10),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: nodeEnv !== 'production',
          migrations: [
            `${__dirname}/../../persistence/typeorm/migrations/*{.ts,.js}`,
          ],
          migrationsRun: nodeEnv === 'production',
          dropSchema: isTest, // Drop schema on each test run for clean state
          ssl:
            nodeEnv === 'production'
              ? {
                  rejectUnauthorized:
                    configService.get('POSTGRES_SSL_REJECT_UNAUTHORIZED') ===
                    'true',
                }
              : false,
          logging: isTest ? false : ['error'],
          maxQueryExecutionTime: isTest ? 1000 : 10000,
          retryAttempts: isTest ? 3 : 10,
          retryDelay: isTest ? 1000 : 3000,
        };
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid TypeORM options passed');
        }

        // Create and initialize the DataSource
        const dataSource = new DataSource(options);
        await dataSource.initialize();

        // Register the DataSource with typeorm-transactional
        addTransactionalDataSource(dataSource);

        return dataSource;
      },
    }),
};
