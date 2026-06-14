import { Prisma, OrderStatus, MenuCategory } from '@/generated/prisma/client.js'


export type CreateMenuInput = {
  sellerId: string
  name: string
  description?: string
  price: number
  category: MenuCategory
  image?: string
  isAvailable?: boolean
  stock?: number
}

export type UpdateMenuInput = Partial<CreateMenuInput>


export interface UpdateOrderStatusInput {
  status: OrderStatus
  alasanPenolakan?: string
}


export interface GetAllMenuQuery {
  sellerId?: string
  category?: MenuCategory
}
