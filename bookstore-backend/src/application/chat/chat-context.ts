import { Book } from '@/domain/book.entity';
import { ChatMessage } from '@/domain/chat/chat-message.entity';

export class ChatContext {
  username: string;
  lastMessages: ChatMessage[];
  conversationSummary: string;
  purchaseHistory?: Book[];
  availableBooks?: Book[];

  constructor(props: {
    username: string;
    lastMessages: ChatMessage[];
    conversationSummary: string;
    purchaseHistory?: Book[];
    availableBooks?: Book[];
  }) {
    this.username = props.username;
    this.lastMessages = props.lastMessages;
    this.conversationSummary = props.conversationSummary;
    this.purchaseHistory = props.purchaseHistory;
    this.availableBooks = props.availableBooks;
  }
}
