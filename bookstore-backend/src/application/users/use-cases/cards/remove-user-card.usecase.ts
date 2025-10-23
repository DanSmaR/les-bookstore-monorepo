import { UsersService } from '@application/users/services';
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { EntityNotFoundException } from '@/application/exceptions';

@Injectable()
export class RemoveUserCard {
  constructor(private readonly usersService: UsersService) {}

  @Transactional()
  public async execute(userId: string, cardId: string): Promise<void> {
    const user = await this.usersService.findActiveByIdOrThrow(userId);

    const card = user.customerDetails.getCard(cardId);

    if (!card) {
      throw new EntityNotFoundException('Card', cardId);
    }

    user.customerDetails.cards.splice(
      user.customerDetails.cards.findIndex((c) => c.equals(card)),
      1,
    );

    await this.usersService.save(user);
  }
}
