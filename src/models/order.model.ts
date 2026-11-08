import { Prisma, OrderStatus, MenuCategory, OrderType, PaymentMethod } from '@/generated/prisma/client.js'

export type CreatePesananInput = {
  sellerId: string
  slot: string
  notes?: string
  orderType: OrderType
  paymentMethod: PaymentMethod
  tableNumber?: string
  items: {
    menuId: string
    quantity: number
    notes?: string
  }[]
}

export type UpdateOrderStatusInput = {
  status: OrderStatus
}
