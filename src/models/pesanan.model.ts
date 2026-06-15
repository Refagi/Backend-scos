import { OrderStatus } from "@/generated/prisma/enums.js"

export interface GetPesanan {
  status?: OrderStatus
}
