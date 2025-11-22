import { DomainEntity } from '@domain/domain.entity';
import { Transactional } from 'typeorm-transactional';

import { BaseRepository } from '@/application/base.repository';

import { EntityNotFoundException } from './exceptions/entity-not-found.exception';
import { UnactiveException } from './exceptions/unactive.exception';
import { PaginatedResult } from './paginated-result';

export abstract class BaseService<E extends DomainEntity> {
  constructor(private readonly commonRepository: BaseRepository<E>) {}

  public async save(entity: E): Promise<E> {
    return this.commonRepository.save(entity);
  }

  @Transactional()
  public async saveAll(entities: E[]): Promise<E[]> {
    return this.commonRepository.saveAll(entities);
  }

  public async findById(id: string): Promise<E | null> {
    return this.commonRepository.findById(id);
  }

  public async findByIdOrThrow(
    id: string,
    entityName: string = 'Entity',
  ): Promise<E> {
    const entity = await this.commonRepository.findById(id);
    if (!entity) {
      throw new EntityNotFoundException(entityName, id);
    }
    return entity;
  }

  public async findActiveByIdOrThrow(
    id: string,
    entityName: string = 'Entity',
  ): Promise<E> {
    const entity = await this.findByIdOrThrow(id, entityName);

    if (!entity.active) {
      throw new UnactiveException(entityName, id);
    }
    return entity;
  }

  public async findAll(
    page: number,
    limit: number,
    filters: Record<string, any> = {},
    sortField?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<PaginatedResult<E>> {
    return this.commonRepository.findAll(
      page,
      limit,
      filters,
      sortField,
      sortOrder,
    );
  }

  public async findAllInPeriod(
    targetColumn: string,
    startDate: Date,
    endDate: Date,
    filters: Record<string, any> = {},
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.commonRepository.findAllInPeriod(
      targetColumn,
      startDate,
      endDate,
      filters,
      sortOrder,
    );
  }

  @Transactional()
  public async inactivate(id: string): Promise<void> {
    const entity = await this.findByIdOrThrow(id, 'Entity');
    entity.inactivate();
    await this.save(entity);
  }

  public async delete(id: string): Promise<void>;
  public async delete(entity: E): Promise<void>;

  @Transactional()
  public async delete(entity: string | E): Promise<void> {
    const entityToDelete =
      typeof entity === 'string'
        ? await this.findByIdOrThrow(entity, 'Entity')
        : entity;
    await this.commonRepository.delete(entityToDelete);
  }
}
