export interface RecommendedBook {
  id: string
  title: string
}

export interface ChatMessageDTO {
  content: string
  role: 'user' | 'assistant'
  sentAt: Date
  booksRecommended: RecommendedBook[]
}

