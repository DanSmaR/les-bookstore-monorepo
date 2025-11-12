import { DomainEntity } from '@domain/domain.entity';

import { PaginatedResult } from './paginated-result';

export interface BaseRepository<E extends DomainEntity> {
  findById(id: string): Promise<E | null>;
  findAll(
    page: number,
    limit: number,
    filters?: Record<string, any>,
    sortField?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<PaginatedResult<E>>;
  findAllInPeriod(
    targetColumn: string,
    startDate: Date,
    endDate: Date,
    filters?: Record<string, any>,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<E[]>;
  save(entity: E): Promise<E>;
  saveAll(entities: E[]): Promise<E[]>;
  deleteById(id: string): Promise<void>;
  delete(entity: E): Promise<void>;
}
