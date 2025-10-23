import { User } from '@domain/user/user.entity';

import { BaseRepository } from '@/application/base.repository';

export interface UsersRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  findActiveById(id: string): Promise<User | null>;
}
