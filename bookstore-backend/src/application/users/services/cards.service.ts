import { Inject, Injectable } from '@nestjs/common';

import { BaseService } from '@/application/base.service';
import { Card } from '@/domain/user/card.entity';

import { CardsRepository } from '../interfaces/cards.repository';

@Injectable()
export class CardsService extends BaseService<Card> {
  constructor(
    @Inject('CardsRepository') private readonly repository: CardsRepository,
  ) {
    super(repository);
  }
}
