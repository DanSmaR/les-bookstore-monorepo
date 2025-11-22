import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DomainEntity } from '../domain.entity';
import { ChatConversation } from './chat-conversation.entity';
import { MessageRole } from './enums/message-role.enum';

@Entity('tb_chat_messages')
export class ChatMessage extends DomainEntity {
  @ManyToOne(() => ChatConversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  conversation: ChatConversation;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: MessageRole })
  role: MessageRole;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date = new Date();

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    booksRecommended?: { id: string; title: string }[]; // Recommended books with ID and title
    requestedPage?: number;
  };

  constructor(props: {
    content: string;
    role: MessageRole;
    metadata?: {
      booksRecommended?: { id: string; title: string }[];
      requestedPage?: number;
    };
  }) {
    super();
    if (props) {
      this.content = props.content;
      this.role = props.role;
      this.metadata = props.metadata;
    }
  }
}
