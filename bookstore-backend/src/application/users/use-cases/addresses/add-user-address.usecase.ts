import { UsersService } from '@application/users/services';
import { Address } from '@domain/user/address.entity';
import { Injectable } from '@nestjs/common';
import { CreateAddressDTO } from '@presentation/site/users/dtos';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class AddUserAddress {
  constructor(private readonly usersService: UsersService) {}

  @Transactional()
  async execute(userId: string, dto: CreateAddressDTO): Promise<Address> {
    const user = await this.usersService.findActiveByIdOrThrow(userId);

    const address = new Address(dto);

    if (!user.customerDetails.hasAddress(address)) {
      user.customerDetails.addresses.push(address);
      await this.usersService.save(user);
    }

    return user.customerDetails.addresses.find((a) => a.equals(address));
  }
}
