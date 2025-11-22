import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { DomainEntity } from '../domain.entity';
import { User } from '../user/user.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('tb_chat_conversations')
export class ChatConversation extends DomainEntity {
  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @OneToMany(() => ChatMessage, (message) => message.conversation, {
    cascade: true,
    eager: true,
  })
  _messages: ChatMessage[];

  constructor(user: User) {
    super();
    if (user) {
      this.user = user;
    }
  }

  get messages(): ChatMessage[] {
    if (!this._messages) {
      this._messages = [];
    }
    return this._messages.sort(
      (a, b) => a.sentAt.getTime() - b.sentAt.getTime(),
    ); // Sort by sentAt ascending
  }

  public getLastMessages(count: number = 10): ChatMessage[] {
    return this.messages.slice(-count); // Get the last 'count' messages
  }
}
