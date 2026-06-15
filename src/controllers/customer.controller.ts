import httpStatusCode from 'http-status-codes'
import { ApiError } from '@/utils/ApiError.js'
import { catchAsync } from '@/utils/catchAsync.js'
import { CustomerService } from '@/services/index.js'
import { type Context } from 'hono'
import type { User } from '@/models/user.model.js'
import type { CreatePesananInput } from '@/models/order.model.js'
import { MenuCategory, OrderStatus } from '@/generated/prisma/client.js'
import type { PesananIdParam } from '@/validations/customer.validation.js'

class CustomerController {

  static getDaftarSeller = catchAsync(async (c: Context) => {
    const sellers = await CustomerService.getDaftarSeller()
    return c.json({ status: httpStatusCode.OK, data: sellers })
  })

  static getMenuSeller = catchAsync(async (c: Context) => {
    const { sellerId } = c.get('parsedParam') as { sellerId: string }
    const { category } = c.get('parsedQuery') as { category?: MenuCategory } ?? {}

    const result = await CustomerService.getMenuSeller(sellerId, category)
    return c.json({ status: httpStatusCode.OK, data: result })
  })


  static buatPesanan = catchAsync(async (c: Context) => {
    const customer = c.get('user') as User

    const body = c.get('parsedJson') as CreatePesananInput
    const pesanan = await CustomerService.buatPesanan(customer.id, body)
    return c.json({ status: httpStatusCode.CREATED, message: 'Pesanan berhasil dibuat', data: pesanan })
  })

  static cancelPesanan = catchAsync(async (c: Context) => {
    const customer = c.get('user') as User
    const param    = c.get('parsedParam') as PesananIdParam
    const pesanan  = await CustomerService.cancelPesanan(customer.id, param.pesananId)
    return c.json({ status: httpStatusCode.OK, message: 'Pesanan berhasil dibatalkan', data: pesanan })
  })

  static konfirmasiPembayaran = catchAsync(async (c: Context) => {
    const customer = c.get('user') as User
    const param    = c.get('parsedParam') as PesananIdParam
    const result   = await CustomerService.konfirmasiPembayaran(customer.id, param.pesananId)
    return c.json({ status: httpStatusCode.OK, message: 'Pesanan Telah di Bayar', data: result })
  })

  static getRiwayatPesanan = catchAsync(async (c: Context) => {
    const customer = c.get('user') as User

    const query = c.get('parsedQuery') as { status?: OrderStatus }
    const pesanan = await CustomerService.getRiwayatPesanan(customer.id, query.status)
    return c.json({ status: httpStatusCode.OK, data: pesanan })
  })

  static getRingkasanPesanan = catchAsync(async (c: Context) => {
    const customer = c.get('user') as User

    const param = c.get('parsedParam') as PesananIdParam
    const ringkasan = await CustomerService.getRingkasanPesanan(customer.id, param.pesananId)
    return c.json({ status: httpStatusCode.OK, data: ringkasan })
  })

  static getDetailPesanan = catchAsync(async (c: Context) => {
    const customer = c.get('user') as User

    const param = c.get('parsedParam') as PesananIdParam
    const pesanan = await CustomerService.getDetailPesanan(customer.id, param.pesananId)
    return c.json({ status: httpStatusCode.OK, data: pesanan })
  })
}

export default CustomerController
