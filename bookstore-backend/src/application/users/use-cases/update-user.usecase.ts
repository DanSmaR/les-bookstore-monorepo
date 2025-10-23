import { User } from '@domain/user/user.entity';
import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from '@presentation/site/users/dtos';
import { Transactional } from 'typeorm-transactional';

import { UsersService } from '../services';
import { UserValidator } from '../validators/user.validator';

@Injectable()
export class UpdateUser {
  constructor(
    private readonly usersService: UsersService,
    private readonly userValidator: UserValidator,
  ) {}

  @Transactional()
  public async execute(id: string, dto: UpdateUserDTO): Promise<User> {
    const user = await this.usersService.findActiveByIdOrThrow(id);

    await this.userValidator.validate(dto, id);

    user.update(dto);
    return await this.usersService.save(user);
  }
}
