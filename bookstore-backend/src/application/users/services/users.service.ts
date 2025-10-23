import { BaseService } from '@application/base.service';
import { User } from '@domain/user/user.entity';
import { Inject, Injectable } from '@nestjs/common';

import { UsersRepository } from '@/application/users/interfaces/users.repository';
import { UserRole } from '@/domain/user/enums/role.enum';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {
    super(usersRepository);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  public async findByCpf(cpf: string): Promise<User | null> {
    return this.usersRepository.findByCpf(cpf);
  }

  public async findActiveCustomerByIdOrThrow(id: string): Promise<User> {
    const user = await this.findActiveByIdOrThrow(id);
    if (user.role === UserRole.ADMIN) {
      throw new Error(`User with id ${id} is not a customer`);
    }
    return user;
  }
}
