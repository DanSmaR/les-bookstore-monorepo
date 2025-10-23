import { UsersService } from '@application/users/services';
import {
  AddUserAddress,
  AddUserCard,
  ChangeUserPassword,
  RemoveUserAddress,
  UpdateUser,
  UpdateUserAddress,
} from '@application/users/use-cases';
import { Injectable } from '@nestjs/common';
import { AddressDTO, UserDTO } from '@presentation/common/users/dtos';

import { RemoveUserCard } from '@/application/users/use-cases/cards/remove-user-card.usecase';
import { CardDTO } from '@/presentation/common/users/dtos/card.dto';

import {
  ChangePasswordDTO,
  CreateAddressDTO,
  CreateCardDTO,
  UpdateAddressDTO,
  UpdateUserDTO,
} from './dtos';

@Injectable()
export class UsersSiteWebService {
  constructor(
    private readonly usersService: UsersService,
    private readonly changeUserPassword: ChangeUserPassword,
    private readonly updateUser: UpdateUser,
    private readonly addUserAddress: AddUserAddress,
    private readonly updateUserAddress: UpdateUserAddress,
    private readonly removeUserAddress: RemoveUserAddress,
    private readonly addUserCard: AddUserCard,
    private readonly removeUserCard: RemoveUserCard,
  ) {}

  public async getProfile(userId: string): Promise<UserDTO> {
    const user = await this.usersService.findByIdOrThrow(userId);
    return new UserDTO(user);
  }

  public async changePassword(
    userId: string,
    dto: ChangePasswordDTO,
  ): Promise<void> {
    await this.changeUserPassword.execute(
      userId,
      dto.oldPassword,
      dto.newPassword,
    );
  }

  public async updateProfile(
    userId: string,
    dto: UpdateUserDTO,
  ): Promise<UserDTO> {
    return new UserDTO(await this.updateUser.execute(userId, dto));
  }

  public async deactivateAccount(userId: string): Promise<void> {
    await this.usersService.inactivate(userId);
  }

  public async getAddresses(userId: string): Promise<AddressDTO[]> {
    const user = await this.usersService.findActiveByIdOrThrow(userId);
    return user.customerDetails.addresses.map(
      (address) => new AddressDTO(address),
    );
  }

  public async createAddress(
    userId: string,
    dto: CreateAddressDTO,
  ): Promise<AddressDTO> {
    const address = await this.addUserAddress.execute(userId, dto);
    return new AddressDTO(address);
  }

  public async updateAddress(
    userId: string,
    addressId: string,
    dto: UpdateAddressDTO,
  ): Promise<AddressDTO> {
    const address = await this.updateUserAddress.execute(
      userId,
      addressId,
      dto,
    );
    return new AddressDTO(address);
  }

  public async deleteAddress(userId: string, addressId: string): Promise<void> {
    await this.removeUserAddress.execute(userId, addressId);
  }

  public async getCards(userId: string): Promise<CardDTO[]> {
    const user = await this.usersService.findActiveByIdOrThrow(userId);
    return user.customerDetails.cards.map((card) => new CardDTO(card));
  }

  public async addCard(userId: string, dto: CreateCardDTO): Promise<CardDTO> {
    return new CardDTO(await this.addUserCard.execute(userId, dto));
  }

  public async removeCard(userId: string, cardId: string): Promise<void> {
    await this.removeUserCard.execute(userId, cardId);
  }
}
