import httpStatusCode from 'http-status-codes'
import prisma from '../../prisma/client.js'
import { ApiError } from '@/utils/ApiError.js'
import { Prisma, OrderStatus, MenuCategory, Role } from '@/generated/prisma/client.js'
import type { UpdateOrderStatusInput, CreatePesananInput  } from '@/models/order.model.js'
import type { CreateMenuInput, UpdateMenuInput } from '@/models/menu.model.js'
import { notifStatusBerubah } from './notifikasi.service'
import type { UpdateSellerTenantBody } from '@/models/tenant.model.js'
import type { GetSemuaPesananQuery } from '@/validations/admin.validation.js'


export interface LaporanFilterInput {
  from?: Date
  to?: Date
  status?: OrderStatus
}


class SellerService {

  static async updateSellerTenant(userId: string, body: UpdateSellerTenantBody) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new ApiError(httpStatusCode.NOT_FOUND, 'Akun tidak ditemukan')
  if (user.role !== Role.seller) {
    throw new ApiError(httpStatusCode.FORBIDDEN, 'Hanya seller yang dapat mengubah data toko')
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...body,
      description: body.description?.trim() || null,
      updatedAt: new Date(),
    },
    select: {
      id: true, name: true, email: true, phone: true,
      role: true, status: true, avatar: true,
      storeName: true, description: true, location: true,
      isOpen: true, openLabel: true, logo: true,
      image: true, qrisImage: true, updatedAt: true,
    },
  })
}

  static async tambahMenu(sellerId: string, body: CreateMenuInput) {
    return prisma.menu.create({
      data: {
        sellerId,
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        image: body.image,
        isAvailable: body.isAvailable ?? true,
      },
    })
  }

  static async editMenu(sellerId: string, menuId: string, body: UpdateMenuInput) {
    const menu = await prisma.menu.findUnique({ where: { id: menuId } })
    if (!menu) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Menu tidak ditemukan')
    }
    if (menu.sellerId !== sellerId) {
      throw new ApiError(httpStatusCode.FORBIDDEN, 'Anda tidak memiliki akses ke menu ini')
    }

    return prisma.menu.update({
      where: { id: menuId },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })
  }

  static async hapusMenu(sellerId: string, menuId: string) {
    const menu = await prisma.menu.findUnique({ where: { id: menuId } })
    if (!menu) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Menu tidak ditemukan')
    }
    if (menu.sellerId !== sellerId) {
      throw new ApiError(httpStatusCode.FORBIDDEN, 'Anda tidak memiliki akses ke menu ini')
    }

    return await prisma.menu.delete({ where: { id: menuId } })
  }

  static async getSemuaMenu(sellerId: string, category?: MenuCategory) {
    return prisma.menu.findMany({
      where: {
        sellerId,
        ...(category && { category }),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

   static async getDetailMenu(sellerId: string, menuId: string) {
    const menu = await prisma.menu.findUnique({ where: { id: menuId } })
    if (!menu) throw new ApiError(httpStatusCode.NOT_FOUND, 'Menu tidak ditemukan')
    if (menu.sellerId !== sellerId) throw new ApiError(httpStatusCode.FORBIDDEN, 'Anda tidak memiliki akses ke menu ini')
    return menu
  }

  static async getSemuaPesanan(sellerId: string, query: GetSemuaPesananQuery = {}) {
  const {
    status,
    page = 1,
    limit = 10
  } = query;

  const skip = (page - 1) * limit;

  const where = {
    sellerId,
    ...(status && { status }),
  };

  // Hitung total
  const total = await prisma.pesanan.count({ where });

  const pesanan = await prisma.pesanan.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      details: {
        include: {
          menu: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: pesanan,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  };
}


  static async getPesananMasuk(sellerId: string, status?: OrderStatus) {
    return prisma.pesanan.findMany({
      where: {
        sellerId,
        ...(status && { status }),
      },
      include: {
        customer: {
          select: { id: true, name: true, avatar: true },
        },
        details: {
          select: {
            id: true, menuId: true, menuName: true, menuPrice: true, quantity: true, subtotal: true, notes: true,},
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getDetailPesanan(sellerId: string, pesananId: string) {
    const pesanan = await prisma.pesanan.findUnique({
      where: { id: pesananId },
      include: {
        customer: {
          select: { id: true, name: true, avatar: true },
        },
        details: {
          include: {
            menu: { select: { id: true, name: true, image: true, category: true, price: true, description: true, isAvailable: true } },
          },
        },
      },
    })

    if (!pesanan) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Pesanan tidak ditemukan')
    }
    if (pesanan.sellerId !== sellerId) {
      throw new ApiError(httpStatusCode.FORBIDDEN, 'Anda tidak memiliki akses ke pesanan ini')
    }

    return pesanan
  }

  static async updateStatusPesanan(sellerId: string, pesananId: string, body: UpdateOrderStatusInput) {
    const pesanan = await prisma.pesanan.findUnique({ where: { id: pesananId }, include: { seller: { select: { storeName: true } } } })
    if (!pesanan) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Pesanan tidak ditemukan')
    }
    if (pesanan.sellerId !== sellerId) {
      throw new ApiError(httpStatusCode.FORBIDDEN, 'Pesanan bukan milik toko Anda')
    }

    const ALLOWED_TRANSITIONS: Record<string, OrderStatus[]> = {
      menunggu: ['diterima', 'ditolak'],
      diterima: ['dimasak', 'ditolak'],
      dimasak:  ['siap'],
      siap:     ['selesai'],
      ditolak:  [],
      selesai:  [],
    }

    const allowed = ALLOWED_TRANSITIONS[pesanan.status] ?? []
    if (!allowed.includes(body.status)) {
      throw new ApiError(
        httpStatusCode.BAD_REQUEST,
        `Tidak bisa mengubah status dari '${pesanan.status}' ke '${body.status}'`,
      )
    }

    const updated = await prisma.pesanan.update({
      where: { id: pesananId },
      data: { status: body.status, updatedAt: new Date() },
      include: {
        customer: { select: { id: true, name: true, avatar: true } },
        details: {
          select: {
            id: true, menuId: true, menuName: true, menuPrice: true, quantity: true, subtotal: true, notes: true,}},
      },
    },
  )

    await notifStatusBerubah({
      customerId:  updated.customerId,
      orderNumber: updated.orderNumber,
      pesananId:   updated.id,
      status:      body.status,
      sellerName:  pesanan.seller?.storeName ?? 'Seller',
    })

    return updated
  }


  static async getLaporanPesanan(
    sellerId: string,
    filter: LaporanFilterInput
  ) {
      const where = {
      sellerId,
      ...(filter.status && { status: filter.status }),
      ...(filter.from || filter.to
        ? {
            createdAt: {
              ...(filter.from && { gte: filter.from }),
              ...(filter.to   && { lte: filter.to   }),
            },
          }
        : {}),
    }

    const [pesananList, totalPendapatan, totalPesanan] = await Promise.all([
      prisma.pesanan.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true } },
          details:  { include: { menu: { select: { id: true, name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Total pendapatan (hanya pesanan selesai)
      prisma.pesanan.aggregate({
        where:   { ...where, status: 'selesai' },
        _sum:    { totalPrice: true },
      }),

      // Total semua pesanan dalam filter
      prisma.pesanan.count({ where }),
    ])

    // Hitung ringkasan per status
    const ringkasanStatus = await prisma.pesanan.groupBy({
      by:      ['status'],
      where,
      _count:  { _all: true },
    })

    // Menu terlaris dari rentang tanggal ini
    const menuTerlaris = await prisma.detailPesanan.groupBy({
      by:      ['menuId', 'menuName'],
      where:   { pesanan: where },
      _sum:    { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take:    5,
    })

    return {
      pesananList,
      ringkasan: {
        totalPesanan,
        totalPendapatan:    totalPendapatan._sum.totalPrice ?? 0,
        ringkasanPerStatus: ringkasanStatus.map((r) => ({
          status: r.status,
          jumlah: r._count._all,
        })),
      },
      menuTerlaris: menuTerlaris.map((m) => ({
        menuId:      m.menuId,
        menuName:    m.menuName,
        totalTerjual: m._sum.quantity  ?? 0,
        totalRevenue: m._sum.subtotal  ?? 0,
      })),
    }
  }

  static async getDashboardSummary(sellerId: string) {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const [
      pesananHariIni,
      pendapatanHariIni,
      totalMenu,
      menuTersedia,
    ] = await Promise.all([
      // Semua pesanan hari ini milik seller ini
      prisma.pesanan.count({
        where: {
          sellerId,
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      }),

      // Pendapatan hari ini (hanya status selesai)
      prisma.pesanan.aggregate({
        where: {
          sellerId,
          status: OrderStatus.selesai,
          createdAt: { gte: todayStart, lte: todayEnd },
        },
        _sum: { totalPrice: true },
      }),

      // Total menu milik seller
      prisma.menu.count({ where: { sellerId } }),

      // Menu yang tersedia
      prisma.menu.count({ where: { sellerId, isAvailable: true } }),
    ])

    return {
      pesananHariIni,
      pendapatanHariIni: pendapatanHariIni._sum.totalPrice ?? 0,
      totalMenu,
      menuTersedia,
    }
  }

  static async getGrafikMingguan(sellerId: string) {
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date()
      day.setDate(day.getDate() - (6 - i))
      return day
    })

    const results = await Promise.all(
      days.map(async (day) => {
        const start = new Date(day)
        start.setHours(0, 0, 0, 0)
        const end = new Date(day)
        end.setHours(23, 59, 59, 999)

        const count = await prisma.pesanan.count({
          where: {
            sellerId,
            createdAt: { gte: start, lte: end },
          },
        })

        return {
          tanggal:       day.toISOString().split('T')[0],
          hari:          day.toLocaleDateString('id-ID', { weekday: 'long' }),
          hariPendek:    day.toLocaleDateString('id-ID', { weekday: 'short' }),
          jumlahPesanan: count,
        }
      })
    )

    return results
  }

  static async getMenuTerlaris(sellerId: string, limit = 5) {
    const result = await prisma.detailPesanan.groupBy({
      by:      ['menuId', 'menuName'],
      where:   { pesanan: { sellerId } },
      _sum:    { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take:    limit,
    })

    return result.map((item, index) => ({
      rank:         index + 1,
      menuId:       item.menuId,
      menuName:     item.menuName,
      totalTerjual: item._sum.quantity ?? 0,
    }))
  }
}

export default SellerService
