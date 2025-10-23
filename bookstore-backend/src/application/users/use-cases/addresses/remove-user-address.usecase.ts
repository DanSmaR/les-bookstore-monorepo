import { EntityNotFoundException } from '@application/exceptions/entity-not-found.exception';
import { CannotRemoveAddressException } from '@application/users/exceptions/cannot-remove-address.exception';
import { UsersService } from '@application/users/services';
import { Address } from '@domain/user/address.entity';
import { AddressPurpose } from '@domain/user/enums/address-purpose.enum';
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class RemoveUserAddress {
  constructor(private readonly usersService: UsersService) {}

  @Transactional()
  async execute(userId: string, addressId: string): Promise<void> {
    const user = await this.usersService.findActiveByIdOrThrow(userId);

    const address = user.customerDetails.getAddress(addressId);

    if (!address) {
      throw new EntityNotFoundException('Address', addressId);
    }

    this.validateAddressRemoval(user.customerDetails.addresses, address);

    user.customerDetails.addresses.slice(
      user.customerDetails.addresses.findIndex((a) => a.equals(address)),
      1,
    );

    await this.usersService.save(user);
  }

  private validateAddressRemoval(
    addresses: Address[],
    addressToRemove: Address,
  ): void {
    const remainingAddresses = addresses.filter(
      (address) => address.id !== addressToRemove.id,
    );

    // Verifica se após a remoção ainda haverá os endereços obrigatórios
    const willHaveBillingAddress = remainingAddresses.some(
      (address) =>
        address.purpose === AddressPurpose.BILLING ||
        address.purpose === AddressPurpose.BOTH,
    );

    const willHaveDeliveryAddress = remainingAddresses.some(
      (address) =>
        address.purpose === AddressPurpose.DELIVERY ||
        address.purpose === AddressPurpose.BOTH,
    );

    const errors: string[] = [];

    // Verifica se o endereço a ser removido é necessário para cobrança
    const isRequiredForBilling =
      addressToRemove.purpose === AddressPurpose.BILLING ||
      addressToRemove.purpose === AddressPurpose.BOTH;

    // Verifica se o endereço a ser removido é necessário para entrega
    const isRequiredForDelivery =
      addressToRemove.purpose === AddressPurpose.DELIVERY ||
      addressToRemove.purpose === AddressPurpose.BOTH;

    if (!willHaveBillingAddress && isRequiredForBilling) {
      errors.push(
        'Não é possível remover o último endereço de cobrança. Cadastre outro endereço de cobrança antes de remover este.',
      );
    }

    if (!willHaveDeliveryAddress && isRequiredForDelivery) {
      errors.push(
        'Não é possível remover o último endereço de entrega. Cadastre outro endereço de entrega antes de remover este.',
      );
    }

    if (errors.length > 0) {
      throw new CannotRemoveAddressException(errors.join(' '));
    }
  }
}
