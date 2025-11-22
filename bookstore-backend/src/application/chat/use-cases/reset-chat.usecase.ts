import { Injectable } from '@nestjs/common';

import { ChatService } from '../services/chat.service';

@Injectable()
export class ResetChat {
  constructor(private readonly service: ChatService) {}

  public async execute(userId: string): Promise<void> {
    const chat = await this.service.findByUserId(userId);
    if (chat) {
      await this.service.delete(chat);
    }
  }
}
