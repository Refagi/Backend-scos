import { Prisma, OrderStatus, MenuCategory } from '@/generated/prisma/client.js'

export type CreatePesananInput = {
  sellerId: string
  slot: string
  notes?: string
  items: {
    menuId: string
    quantity: number
    notes?: string
  }[]
}

export type UpdateOrderStatusInput = {
  status: OrderStatus
}
