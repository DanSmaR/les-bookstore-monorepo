import type { CardDTO, CreateCardDTO } from '@/dtos/card'

import { AxiosApp } from './axios-app'

export interface UpdateCardData {
  holderName?: string
  expirationDate?: Date
}

export class CardService {
  private static readonly BASE_URL = '/me/cards'

  /**
   * Get all user's cards
   */
  static async getCards(): Promise<CardDTO[]> {
    const response = await AxiosApp.get<CardDTO[]>(this.BASE_URL)
    return response.data
  }

  /**
   * Get a specific card by ID
   */
  static async getCard(cardId: string): Promise<CardDTO> {
    const response = await AxiosApp.get<CardDTO>(`${this.BASE_URL}/${cardId}`)
    return response.data
  }

  /**
   * Create a new card
   */
  static async createCard(cardData: CreateCardDTO): Promise<CardDTO> {
    const response = await AxiosApp.post<CardDTO>(this.BASE_URL, cardData)
    return response.data
  }

  /**
   * Update an existing card
   */
  static async updateCard(
    cardId: string,
    cardData: UpdateCardData,
  ): Promise<CardDTO> {
    const response = await AxiosApp.put<CardDTO>(
      `${this.BASE_URL}/${cardId}`,
      cardData,
    )
    return response.data
  }

  /**
   * Delete a card
   */
  static async deleteCard(cardId: string): Promise<void> {
    await AxiosApp.delete(`${this.BASE_URL}/${cardId}`)
  }
}
