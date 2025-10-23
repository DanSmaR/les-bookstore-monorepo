import { PaginatedResult } from '@application/paginated-result';
import { DomainEntity } from '@domain/domain.entity';
import { FindOptionsOrder, FindOptionsWhere, ILike, Repository } from 'typeorm';

import { BaseRepository } from '@/application/base.repository';

export abstract class CRUDRepository<E extends DomainEntity>
  implements BaseRepository<E>
{
  protected constructor(protected readonly repository: Repository<E>) {}

  public async findById(id: string): Promise<E | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<E>,
    });
  }

  private getSafeSortField(sortField: string): string {
    const metadata = this.repository.metadata;
    const columnNames = metadata.columns.map((column) => column.propertyName);

    if (columnNames.includes(sortField)) {
      return sortField;
    }

    return 'createdAt';
  }

  private getSearchableColumns(): string[] {
    const metadata = this.repository.metadata;
    // Filter only string/text columns for searching
    return metadata.columns
      .filter(
        (column) =>
          column.type === 'varchar' ||
          column.type === 'text' ||
          column.type === 'char' ||
          column.type === String,
      )
      .map((column) => column.propertyName);
  }

  private sanitizeFilters(filters: Record<string, any>): Record<string, any> {
    const metadata = this.repository.metadata;
    const columnNames = metadata.columns.map((column) => column.propertyName);

    const sanitizedFilters: Record<string, any> = {};
    for (const key in filters) {
      if (columnNames.includes(key) && filters[key] != null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        sanitizedFilters[key] = filters[key];
      }
    }

    return sanitizedFilters;
  }

  private buildSearchConditions(searchTerm: string): FindOptionsWhere<E>[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const searchableColumns = this.getSearchableColumns();
    const searchConditions: FindOptionsWhere<E>[] = [];

    searchableColumns.forEach((column) => {
      searchConditions.push({
        [column]: ILike(`%${searchTerm.trim()}%`),
      } as FindOptionsWhere<E>);
    });

    return searchConditions;
  }

  public async findAll(
    page: number,
    limit: number,
    filters: Record<string, any> = {},
    sortField: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<PaginatedResult<E>> {
    const skip = (page - 1) * limit;
    const safeSortField = this.getSafeSortField(sortField);
    const sanitizedFilters = this.sanitizeFilters(filters);

    let whereConditions: FindOptionsWhere<E> | FindOptionsWhere<E>[];

    if (filters['search'] && typeof filters['search'] === 'string') {
      // If there's a search term, combine it with filters
      const searchConditions = this.buildSearchConditions(filters['search']);

      if (Object.keys(sanitizedFilters).length > 0) {
        // Combine search with filters - each search condition must also match the filters
        whereConditions = searchConditions.map((searchCondition) => ({
          ...sanitizedFilters,
          ...searchCondition,
        }));
      } else {
        // Only search conditions
        whereConditions = searchConditions;
      }
    } else {
      // No search, only filters
      whereConditions = sanitizedFilters;
    }

    const [entities, total] = await this.repository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      order: {
        [safeSortField]: sortOrder,
      } as FindOptionsOrder<E>,
    });

    return new PaginatedResult<E>(entities, total);
  }

  public async save(entity: E): Promise<E> {
    return this.repository.save(entity);
  }

  public async saveAll(entities: E[]): Promise<E[]> {
    return this.repository.save(entities);
  }

  public async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id } as FindOptionsWhere<E>);
  }

  public async delete(entity: E): Promise<void> {
    await this.repository.remove(entity);
  }
}
