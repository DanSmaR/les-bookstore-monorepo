import { InvalidCardNumberException } from '@application/users/exceptions/invalid-card-number.exception';
import { UsersService } from '@application/users/services';
import { ConflictException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Card } from '@/domain/user/card.entity';
import { CardBrand } from '@/domain/user/enums/card-brand.enum';
import { CreateCardDTO } from '@/presentation/site/users/dtos';

@Injectable()
export class AddUserCard {
  constructor(private readonly usersService: UsersService) {}

  @Transactional()
  public async execute(userId: string, dto: CreateCardDTO): Promise<Card> {
    const user = await this.usersService.findActiveByIdOrThrow(userId);

    if (user.customerDetails.hasCard(dto.number)) {
      throw new ConflictException('Card already exists for this user.');
    }

    user.customerDetails.cards.push(
      new Card({ ...dto, brand: this.validateNumber(dto.number) }),
    );
    await this.usersService.save(user);

    return user.customerDetails.getCard(dto.number);
  }

  private validateNumber(cardNumber: string): CardBrand {
    if (!this.isValidLuhn(cardNumber)) {
      throw new InvalidCardNumberException(
        'Invalid card number - failed Luhn check',
      );
    }

    const brand = this.determineBrand(cardNumber);
    if (!brand) {
      throw new InvalidCardNumberException('Unsupported card brand');
    }

    return brand;
  }

  private isValidLuhn(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;

    // Loop through digits from right to left
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  private determineBrand(cardNumber: string): CardBrand | null {
    // Visa: starts with 4, 13-19 digits
    if (/^4\d{12,18}$/.test(cardNumber)) {
      return CardBrand.VISA;
    }

    // Mastercard: starts with 5[1-5] or 2[2-7], 16 digits
    if (/^(5[1-5]\d{14}|2[2-7]\d{14})$/.test(cardNumber)) {
      return CardBrand.MASTERCARD;
    }

    // American Express: starts with 34 or 37, 15 digits
    if (/^3[47]\d{13}$/.test(cardNumber)) {
      return CardBrand.AMERICAN_EXPRESS;
    }

    // Discover: starts with 6011, 622126-622925, 644-649, or 65, 16 digits
    if (
      /^(6011\d{12}|62212[6-9]\d{10}|6221[3-9]\d{11}|622[2-8]\d{12}|6229[01]\d{11}|62292[0-5]\d{10}|64[4-9]\d{13}|65\d{14})$/.test(
        cardNumber,
      )
    ) {
      return CardBrand.DISCOVER;
    }

    // Diners Club: starts with 300-305, 36, or 38, 14 digits
    if (/^(30[0-5]\d{11}|3[68]\d{12})$/.test(cardNumber)) {
      return CardBrand.DINERS_CLUB;
    }

    // JCB: starts with 35, 16 digits
    if (/^35\d{14}$/.test(cardNumber)) {
      return CardBrand.JCB;
    }

    return null;
  }
}
