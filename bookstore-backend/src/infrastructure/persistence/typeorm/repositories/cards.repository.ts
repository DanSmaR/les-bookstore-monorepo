import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CardsRepository } from '@/application/users/interfaces/cards.repository';
import { Card } from '@/domain/user/card.entity';

import { CRUDRepository } from './base.repository';

@Injectable()
export class CardsRepositoryImpl
  extends CRUDRepository<Card>
  implements CardsRepository
{
  constructor(@InjectRepository(Card) repository: Repository<Card>) {
    super(repository);
  }
}
