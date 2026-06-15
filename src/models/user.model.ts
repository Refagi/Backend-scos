import { Prisma } from '@/generated/prisma/client.js';
import { Role, UserStatus, OrderStatus, MenuCategory } from '@/generated/prisma/client.js'

export type User = Prisma.UserGetPayload<{}>;

export type CreateUserInput = {
  name: string
  email: string
  phone?: string
  password: string
  role: Role
  status?: UserStatus
  // seller only
  storeName?: string
  description?: string
  location?: string
  isOpen?: boolean
  openLabel?: string
  logo?: string
  image?: string
  qrisImage?: string
}


export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password' | 'role'>>

