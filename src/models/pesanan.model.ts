import { OrderStatus } from "@/generated/prisma/enums"

export interface GetPesanan {
  status?: OrderStatus
}
