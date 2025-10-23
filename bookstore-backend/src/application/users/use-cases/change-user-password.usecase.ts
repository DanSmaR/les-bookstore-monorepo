import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Transactional } from 'typeorm-transactional';

import { InvalidCredentialsException } from '@/application/auth/exceptions/invalid-credentials.exception';

import { UsersService } from '../services';

@Injectable()
export class ChangeUserPassword {
  constructor(private readonly usersService: UsersService) {}

  @Transactional()
  public async execute(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersService.findActiveByIdOrThrow(userId);

    if (!(await bcrypt.compare(oldPassword, user.password)))
      throw new InvalidCredentialsException('Old password is incorrect');

    user.password = await bcrypt.hash(newPassword, 10);

    await this.usersService.save(user);
  }
}
