import httpStatusCode from 'http-status-codes'
import { ApiError } from '@/utils/ApiError.js'
import { catchAsync } from '@/utils/catchAsync.js'
import { SellerService } from '@/services/index.js'
import { type Context } from 'hono'
import type { User } from '@/models/user.model.js'
import type { CreateMenuInput, UpdateMenuInput } from '@/models/menu.model.js'
import type { UpdateOrderStatusInput } from '@/models/order.model.js'
import { MenuCategory, OrderStatus } from '@/generated/prisma/client.js'
import type { UpdateSellerTenantBody } from '@/models/tenant.model.js'
import type { GetPesanan } from '@/models/pesanan.model.js'
import type {  PesananIdParam, MenuIdParam, GetLaporanQuery } from '@/validations/seller.validation.js'

class SellerController {
  static updateSellerTenant = catchAsync(async (c: Context) => {
    const user = c.get('user') as User

    const body   = c.get('parsedJson') as UpdateSellerTenantBody
    const data   = await SellerService.updateSellerTenant(user.id, body)
    return c.json({ status: httpStatusCode.OK, message: 'Data toko berhasil diperbarui', data })
  })

  static tambahMenu = catchAsync(async (c: Context) => {
    const seller = c.get('user') as User
    const body = c.get('parsedJson') as CreateMenuInput
    const menu = await SellerService.tambahMenu(seller.id, body)
    return c.json({ status: httpStatusCode.CREATED, message: 'Menu berhasil ditambahkan', data: menu })
  })

  static editMenu = catchAsync(async (c: Context) => {
    const seller = c.get('user') as User
    const param = c.get('parsedParam') as MenuIdParam
    const body = c.get('parsedJson') as UpdateMenuInput
    const menu = await SellerService.editMenu(seller.id, param.menuId, body)
    return c.json({ status: httpStatusCode.OK, message: 'Menu berhasil diperbarui', data: menu })
  })

  static hapusMenu = catchAsync(async (c: Context) => {
    const seller = c.get('user') as User
    const param = c.get('parsedParam') as MenuIdParam
    await SellerService.hapusMenu(seller.id, param.menuId)
    return c.json({ status: httpStatusCode.OK, message: 'Menu berhasil dihapus' })
  })

  static getSemuaMenu = catchAsync(async (c: Context) => {
    const seller = c.get('user') as User
    const query = c.get('parsedQuery') as MenuCategory
    const menus = await SellerService.getSemuaMenu(seller.id, query)
    return c.json({ status: httpStatusCode.OK, data: menus })
  })

  static getDetailMenu = catchAsync(async (c: Context) => {
    const seller = c.get('user') as User
    const param = c.get('parsedParam') as MenuIdParam
    const menu = await SellerService.getDetailMenu(seller.id, param.menuId)
    return c.json({ status: httpStatusCode.OK, data: menu })
  })

  static getPesananMasuk = catchAsync(async (c: Context) => {
    const seller = c.get('user') as User
    const query   = c.get('parsedQuery') as GetPesanan
    const pesanan = await SellerService.getPesananMasuk(seller.id, query.status)
    return c.json({ status: httpStatusCode.OK, data: pesanan })
  })

  static getDetailPesanan = catchAsync(async (c: Context) => {
    const seller = c.get('user') as User
    const param = c.get('parsedParam') as PesananIdParam
    const pesanan = await SellerService.getDetailPesanan(seller.id, param.pesananId)
    return c.json({ status: httpStatusCode.OK, data: pesanan })
  })

  static updateStatusPesanan = catchAsync(async (c: Context) => {
    const seller = c.get('user') as User
    const param = c.get('parsedParam') as PesananIdParam
    const body = c.get('parsedJson') as UpdateOrderStatusInput
    const pesanan = await SellerService.updateStatusPesanan(seller.id, param.pesananId, body)
    return c.json({ status: httpStatusCode.OK, message: 'Status pesanan berhasil diperbarui', data: pesanan })
  })


  static getLaporanPesanan = catchAsync(async (c: Context) => {
    const seller = c.get('user') as User
    const query = c.get('parsedQuery') as GetLaporanQuery
    const laporan = await SellerService.getLaporanPesanan(seller.id, {
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
      status: query.status as OrderStatus | undefined,
    })
    return c.json({ status: httpStatusCode.OK, data: laporan })
  })

  static getDashboardSummary = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    const data = await SellerService.getDashboardSummary(user.id)
    return c.json({ status: httpStatusCode.OK, data })
  })

  static getGrafikMingguan = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    const data = await SellerService.getGrafikMingguan(user.id)
    return c.json({ status: httpStatusCode.OK, data })
  })

  static getMenuTerlaris = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    const data = await SellerService.getMenuTerlaris(user.id, 5)
    return c.json({ status: httpStatusCode.OK, data })
  })

}

export default SellerController
