import { ChatCircle, PaperPlaneTilt, Trash, X } from 'phosphor-react'
import React, { useEffect, useRef, useState } from 'react'

import type { BookDTO } from '@/dtos'
import type { ChatMessageDTO } from '@/dtos/chat'
import { BookDetailsModal } from '@/pages/site/books/pages/catalog/components/book-details-modal'
import { useCart, useToast } from '@/providers'
import { BookService, ChatService } from '@/services'

import * as S from './styles'

const AI_TIMEOUT_MS = 35000 // Slightly longer than backend (35s)

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessageDTO[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [selectedBook, setSelectedBook] = useState<BookDTO | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // eslint-disable-next-line no-undef
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const toast = useToast()
  const { addItem } = useCart()

  // Load active conversation when opening chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadActiveConversation()
    }
  }, [isOpen])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [])

  const loadActiveConversation = async () => {
    try {
      const conversation = await ChatService.getConversation()
      setMessages(conversation.messages)
    } catch (error: unknown) {
      // If conversation doesn't exist (404), show empty chat
      // Conversation will be created automatically on first message
      const apiError = error as { statusCode?: number }
      if (apiError.statusCode === 404) {
        setMessages([])
        return
      }
      console.error('Erro ao carregar conversa:', error)
      toast.showError('Erro ao carregar conversa. Tente novamente.')
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage = inputMessage
    setInputMessage('')
    setLoading(true)
    setElapsedTime(0)

    // Add user message optimistically
    const tempTimestamp = Date.now()
    const tempUserMsg: ChatMessageDTO = {
      content: userMessage,
      role: 'user',
      sentAt: new Date(tempTimestamp),
      booksRecommended: [],
    }

    setMessages((prev) => [...prev, tempUserMsg])

    // Track elapsed time
    intervalRef.current = window.setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    // Set frontend timeout
    timeoutRef.current = window.setTimeout(() => {
      if (loading) {
        setLoading(false)
        setElapsedTime(0)
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        toast.showError(
          'O assistente está demorando para responder. Tente novamente.',
        )
        // Remove temp message
        setMessages((prev) =>
          prev.filter(
            (m) =>
              !(
                m.role === 'user' &&
                m.content === userMessage &&
                m.sentAt.getTime() === tempTimestamp
              ),
          ),
        )
      }
    }, AI_TIMEOUT_MS)

    try {
      const response = await ChatService.sendMessage(userMessage)

      // Clear timeouts on success
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      // Replace temp message and add assistant response
      // Remove the temp message by matching content and timestamp
      setMessages((prev) => {
        const filtered = prev.filter(
          (m) =>
            !(
              m.role === 'user' &&
              m.content === userMessage &&
              m.sentAt.getTime() === tempTimestamp
            ),
        )
        return [...filtered, response.userMessage, response.assistantMessage]
      })
      setElapsedTime(0)
    } catch (error) {
      // Clear timeouts on error
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      console.error('Erro ao enviar mensagem:', error)

      // Check if it's a timeout error
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      const apiError = error as { response?: { data?: { message?: string } } }
      const backendMessage = apiError.response?.data?.message || ''

      if (
        errorMessage.includes('timeout') ||
        errorMessage.includes('demorando') ||
        backendMessage.includes('demorando')
      ) {
        toast.showError(
          'O assistente demorou muito para responder. Tente novamente.',
        )
      } else {
        toast.showError('Erro ao enviar mensagem. Tente novamente.')
      }

      // Remove temp message on error
      setMessages((prev) =>
        prev.filter(
          (m) =>
            !(
              m.role === 'user' &&
              m.content === userMessage &&
              m.sentAt.getTime() === tempTimestamp
            ),
        ),
      )
      setElapsedTime(0)
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line no-undef
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetConversation = async () => {
    try {
      await ChatService.resetConversation()
      setMessages([])
      toast.showSuccess('Conversa resetada com sucesso.')
    } catch (error) {
      console.error('Erro ao resetar conversa:', error)
      toast.showError('Erro ao resetar conversa. Tente novamente.')
    }
  }

  const handleBookClick = async (bookId: string) => {
    try {
      const book = await BookService.getBookById(bookId)
      setSelectedBook(book)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Erro ao carregar detalhes do livro:', error)
      toast.showError('Erro ao carregar detalhes do livro. Tente novamente.')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBook(null)
  }

  const handleAddToCart = (book: BookDTO) => {
    addItem(book, 1)
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <S.FloatingButton
          onClick={() => setIsOpen(true)}
          aria-label="Abrir assistente virtual"
        >
          <ChatCircle size={24} weight="fill" />
        </S.FloatingButton>
      )}

      {/* Chat window */}
      {isOpen && (
        <S.ChatWindow>
          {/* Header */}
          <S.ChatHeader>
            <S.ChatTitle>Assistente Virtual</S.ChatTitle>
            <S.HeaderActions>
              {messages.length > 0 && (
                <S.ResetButton
                  onClick={resetConversation}
                  aria-label="Resetar conversa"
                  title="Resetar conversa"
                >
                  <Trash size={18} weight="bold" />
                </S.ResetButton>
              )}
              <S.CloseButton
                onClick={() => setIsOpen(false)}
                aria-label="Fechar chat"
              >
                <X size={20} weight="bold" />
              </S.CloseButton>
            </S.HeaderActions>
          </S.ChatHeader>

          {/* Messages */}
          <S.MessagesContainer>
            {messages.length === 0 && (
              <S.EmptyState>
                <ChatCircle size={48} weight="duotone" />
                <S.EmptyStateTitle>
                  Olá! Como posso ajudar você hoje?
                </S.EmptyStateTitle>
                <S.EmptyStateSubtitle>
                  Posso recomendar livros baseado no seu histórico!
                </S.EmptyStateSubtitle>
              </S.EmptyState>
            )}

            {messages.map((msg, index) => (
              <S.MessageWrapper
                key={`${msg.role}-${index}-${msg.sentAt.getTime()}`}
                isUser={msg.role === 'user'}
              >
                <S.MessageBubble isUser={msg.role === 'user'}>
                  {msg.content}
                  {msg.booksRecommended && msg.booksRecommended.length > 0 && (
                    <S.RecommendedBooksContainer>
                      <S.RecommendedBooksTitle>
                        Livros recomendados:
                      </S.RecommendedBooksTitle>
                      <S.RecommendedBooksList>
                        {msg.booksRecommended.map((book) => (
                          <S.RecommendedBookCard
                            key={book.id}
                            onClick={() => handleBookClick(book.id)}
                            role="button"
                            tabIndex={0}
                            onKeyUp={(
                              // eslint-disable-next-line no-undef
                              e: React.KeyboardEvent<HTMLDivElement>,
                            ) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleBookClick(book.id)
                              }
                            }}
                          >
                            {book.title}
                          </S.RecommendedBookCard>
                        ))}
                      </S.RecommendedBooksList>
                    </S.RecommendedBooksContainer>
                  )}
                </S.MessageBubble>
              </S.MessageWrapper>
            ))}

            {loading && (
              <S.LoadingIndicator>
                <S.LoadingBubble>
                  <S.LoadingDots>
                    <S.LoadingDot delay="0s" />
                    <S.LoadingDot delay="0.1s" />
                    <S.LoadingDot delay="0.2s" />
                  </S.LoadingDots>
                  {elapsedTime > 5 && (
                    <S.LoadingMessage>
                      Aguardando resposta... ({elapsedTime}s)
                    </S.LoadingMessage>
                  )}
                </S.LoadingBubble>
              </S.LoadingIndicator>
            )}
            <div ref={messagesEndRef} />
          </S.MessagesContainer>

          {/* Input */}
          <S.InputContainer>
            <S.InputWrapper>
              <S.ChatInput
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={loading}
              />
              <S.SendButton
                onClick={sendMessage}
                disabled={loading || !inputMessage.trim()}
                aria-label="Enviar mensagem"
              >
                <PaperPlaneTilt size={20} weight="bold" />
              </S.SendButton>
            </S.InputWrapper>
          </S.InputContainer>
        </S.ChatWindow>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  )
}
