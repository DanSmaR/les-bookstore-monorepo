import { InvalidBodyException } from '@application/exceptions/invalid-body.exception';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationErrorFormatter } from '@presentation/validation-error.formatter';
import { ValidationError } from 'class-validator';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const errorMessages = ValidationErrorFormatter.formatAsObject(errors);
        return new InvalidBodyException('Invalid Body', errorMessages);
      },
      transform: true,
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(
    `Server running on http://localhost:${process.env.PORT ?? 3000}`,
    'Bootstrap',
  );
}
bootstrap().catch((error) => {
  Logger.error('Failed to start the application', error, 'Bootstrap');
  process.exit(1);
});
