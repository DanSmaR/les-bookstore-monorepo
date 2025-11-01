import { ORMS } from '@infrastructure/nestjs/modules/orms';
import { Module } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';

@Module({
  providers: [],
  imports: [ORMS.typeorm()],
  exports: [],
})
export class DatabaseModule {
  constructor() {
    initializeTransactionalContext();
  }
}
