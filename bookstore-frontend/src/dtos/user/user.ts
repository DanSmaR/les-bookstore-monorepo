import type { Gender } from '@/utils/types'

import type { OrderDTO } from '../order'
import type { AddressDTO } from './address'

export type UserDTO = {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  gender: Gender
  birthDate: Date
  addresses: AddressDTO[]
  orders: OrderDTO[]
  createdAt: Date
  updatedAt: Date
  active: boolean
}
