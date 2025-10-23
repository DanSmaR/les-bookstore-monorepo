import { Address } from '@domain/user/address.entity';
import { User } from '@domain/user/user.entity';
import { Injectable } from '@nestjs/common';
import { NewUserDTO } from '@presentation/auth/dtos/new-user.dto';
import * as bcrypt from 'bcryptjs';
import { Transactional } from 'typeorm-transactional';

import { UsersService } from '../services';
import { UserValidator } from '../validators/user.validator';

@Injectable()
export class CreateNewUser {
  constructor(
    private readonly usersService: UsersService,
    private readonly userValidator: UserValidator,
  ) {}

  @Transactional()
  async execute(dto: NewUserDTO): Promise<User> {
    await this.userValidator.validate(dto);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new User({ ...dto, password: hashedPassword });

    user.customerDetails.addresses.push(new Address(dto.address));

    return this.usersService.save(user);
  }
}
