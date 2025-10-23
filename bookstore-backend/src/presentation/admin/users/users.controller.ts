import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserDTO } from '@presentation/common/users/dtos';

import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/infrastructure/auth/guards';
import { PaginatedResultDTO } from '@/presentation/dtos/paginated-result.dto';
import { PaginationParamsDTO } from '@/presentation/dtos/pagination-params.dto';

import { MinUserDTO } from './dtos/min-user.dto';
import { UsersWebService } from './users.webservice';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersWebService: UsersWebService) {}

  @Get()
  public async findAll(
    @Query() query: PaginationParamsDTO,
    @Query() filters: Record<string, any> = {},
  ): Promise<PaginatedResultDTO<MinUserDTO>> {
    return this.usersWebService.findAll(query, filters);
  }

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<UserDTO> {
    return await this.usersWebService.findById(id);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.usersWebService.inactivate(id);
  }
}
