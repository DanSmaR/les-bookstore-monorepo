import { User } from '@domain/user/user.entity';
import { CRUDRepository } from '@infrastructure/persistence/typeorm/repositories';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersRepository } from '@/application/users/interfaces/users.repository';

@Injectable()
export class UsersRepositoryImpl
  extends CRUDRepository<User>
  implements UsersRepository
{
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email });
  }

  public async findByCpf(cpf: string): Promise<User | null> {
    return await this.repository.findOneBy({ cpf });
  }

  public async findActiveById(id: string): Promise<User | null> {
    return await this.repository.findOneBy({ id, active: true });
  }
}
