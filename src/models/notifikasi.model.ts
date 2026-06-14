import type { Role, NotifType } from '@/generated/prisma/client.js'
export interface CreateNotifParams {
  userId: string
  role: Role
  title: string
  message: string
  type?: NotifType
  pesananId?: string
  menuId?: string
}
