import { UsersService } from '@application/users/services';
import { Injectable } from '@nestjs/common';
import { UserDTO } from '@presentation/common/users/dtos';

import { UserRole } from '@/domain/user/enums/role.enum';
import { PaginatedResultDTO } from '@/presentation/dtos/paginated-result.dto';
import { PaginationParamsDTO } from '@/presentation/dtos/pagination-params.dto';

import { MinUserDTO } from './dtos';

@Injectable()
export class UsersWebService {
  constructor(private readonly usersService: UsersService) {}

  public async findById(id: string): Promise<UserDTO> {
    const user = await this.usersService.findByIdOrThrow(id);
    return new UserDTO(user);
  }

  public async findAll(
    params: PaginationParamsDTO,
    filters: Record<string, any> = {},
  ): Promise<PaginatedResultDTO<MinUserDTO>> {
    // Add filter to exclude admin users from customer list
    const customersOnlyFilters = {
      ...filters,
      role: UserRole.USER,
    };

    const result = await this.usersService.findAll(
      params.page,
      params.limit,
      customersOnlyFilters,
      params.orderBy,
    );

    return new PaginatedResultDTO(
      result.items.map((item) => new MinUserDTO(item)),
      result.count,
      params.limit,
      params.page,
    );
  }

  public async inactivate(id: string): Promise<void> {
    await this.usersService.inactivate(id);
  }
}
