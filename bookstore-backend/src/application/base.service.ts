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

  public async findByIdOrThrow(id: string): Promise<E> {
    const entity = await this.commonRepository.findById(id);
    if (!entity) {
      throw new EntityNotFoundException('Entity', id);
    }
    return entity;
  }

  public async findActiveByIdOrThrow(id: string): Promise<E> {
    const entity = await this.findByIdOrThrow(id);

    if (!entity.active) {
      throw new UnactiveException('Entity', id);
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

  @Transactional()
  public async inactivate(id: string): Promise<void> {
    const entity = await this.findByIdOrThrow(id);
    entity.inactivate();
    await this.save(entity);
  }

  @Transactional()
  public async delete(id: string): Promise<void> {
    const entity = await this.findByIdOrThrow(id);
    await this.commonRepository.delete(entity);
  }
}
