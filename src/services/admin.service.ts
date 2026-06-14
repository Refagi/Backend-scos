import httpStatusCode from 'http-status-codes'
import prisma from '@/../prisma/client.js'
import { ApiError } from '@/utils/ApiError.js'
import { Role, UserStatus, OrderStatus, MenuCategory } from '@/generated/prisma/client.js'
import type { CreateMenuInput, UpdateMenuInput, GetAllMenuQuery } from '@/models/menu.model.js'
import type { UpdateOrderStatusInput } from '@/models/order.model.js'
import type { CreateUserInput, UpdateUserInput } from '@/models/user.model.js'
import type { GetDaftarAkunQuery, GetSemuaPesananQuery } from '@/validations/admin.validation.js'


class AdminService {

  static async tambahAkun(body: CreateUserInput) {
    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) {
      throw new ApiError(httpStatusCode.CONFLICT, 'Email sudah digunakan')
    }

    if (body.role === Role.seller) {
      if (!body.storeName || !body.location) {
        throw new ApiError(httpStatusCode.BAD_REQUEST, 'storeName dan location wajib diisi untuk seller')
      }
    }

    return prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: body.password,
        role: body.role,
        status: body.status ?? UserStatus.active,
        // seller fields
        storeName: body.storeName,
        description: body.description,
        location: body.location,
        isOpen: body.isOpen ?? true,
        openLabel: body.openLabel,
        logo: body.logo,
        image: body.image,
        qrisImage: body.qrisImage,
      },
    })
  }

  static async editAkun(userId: string, body: UpdateUserInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.role === Role.admin) {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Admin tidak bisa edit admin')
    }
    if (!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Akun tidak ditemukan')
    }

    if (body.email) {
      const existing = await prisma.user.findUnique({ where: { email: body.email } })
      if (existing && existing.id !== userId) {
        throw new ApiError(httpStatusCode.CONFLICT, 'Email sudah digunakan')
      }
    }

    return prisma.user.update({
      where: { id: userId },
      data: { ...body, updatedAt: new Date() },
    })
  }

  static async hapusAkun(userId: string, currentAdminId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Akun tidak ditemukan')
    }
    if (user.role === Role.admin && user.id !== currentAdminId) {
      throw new ApiError(httpStatusCode.FORBIDDEN, 'Akun admin tidak dapat dihapus')
    }

   return await prisma.user.delete({ where: { id: userId } })
  }

  static async getDaftarAkun(query: GetDaftarAkunQuery) {
    const { role, status, page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    const where = {
        ...(role && { role }),
        ...(status && { status }),
      }

    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        storeName: true,
        location: true,
        isOpen: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

  return {
    data: users,
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


static async tambahMenu(body: CreateMenuInput) {
  const seller = await prisma.user.findUnique({
    where: { id: body.sellerId },
    select: { id: true, role: true, storeName: true }
  })

  if (!seller) {
    throw new ApiError(httpStatusCode.NOT_FOUND, 'Seller tidak ditemukan')
  }

  const existing = await prisma.menu.findFirst({
    where: {
      sellerId: body.sellerId,
      name: {
        equals: body.name,
        mode: 'insensitive'
      },
    }
  })

  if (existing) {
    throw new ApiError(httpStatusCode.CONFLICT, 'Menu dengan nama tersebut sudah ada untuk seller ini')
  }

  return prisma.menu.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      image: body.image,
      stock: body.stock ?? 0,
      isAvailable: body.isAvailable ?? true,
      sellerId: body.sellerId,
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          storeName: true,
        }
      }
    }
  })
}

  static async getDetailAkun(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatar: true,
        storeName: true,
        description: true,
        location: true,
        isOpen: true,
        openLabel: true,
        logo: true,
        image: true,
        qrisImage: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Akun tidak ditemukan')
    }

    return user
  }


  static async getSemuaMenu(query: GetAllMenuQuery) {
    return prisma.menu.findMany({
      where: {
        ...(query.sellerId && {  sellerId: query.sellerId }),
        ...(query.category && {  category: query.category }),
      },
      include: {
        seller: { select: { id: true, name: true, storeName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getDetailMenu(menuId: string) {
    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            storeName: true
          }
        },
      },
    })
    if (!menu) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Menu tidak ditemukan')
    }

  return menu
}

  static async editMenu(menuId: string, body: UpdateMenuInput) {
    const menu = await prisma.menu.findUnique({ where: { id: menuId } })
    if (!menu) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Menu tidak ditemukan')
    }

    return prisma.menu.update({
      where: { id: menuId },
      data: { ...body, description: body.description?.trim() || null, updatedAt: new Date() },
      include: {
        seller: { select: { id: true, name: true, storeName: true } },
      },
    })
  }

  static async hapusMenu(menuId: string) {
    const menu = await prisma.menu.findUnique({ where: { id: menuId } })
    if (!menu) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Menu tidak ditemukan')
    }

    await prisma.menu.delete({ where: { id: menuId } })
    return { message: 'Menu berhasil dihapus' }
  }


  static async getSemuaPesanan(query: GetSemuaPesananQuery = {}) {
  const {
    status,
    page = 1,
    limit = 10
  } = query;

  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
  };

  const total = await prisma.pesanan.count({ where });

  const pesanan = await prisma.pesanan.findMany({
    where,
    include: {
      customer: { select: { id: true, name: true, avatar: true } },
      seller: { select: { id: true, name: true, storeName: true } },
      details: {
        include: {
          menu: { select: { id: true, name: true, image: true } },
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

  static async updateStatusPesanan(pesananId: string, body: UpdateOrderStatusInput) {
    const pesanan = await prisma.pesanan.findUnique({ where: { id: pesananId } })
    if (!pesanan) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Pesanan tidak ditemukan')
    }

    return prisma.pesanan.update({
      where: { id: pesananId },
      data: { status: body.status, updatedAt: new Date() },
      include: {
        customer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true, storeName: true } },
        details: true,
      },
    })
  }

  static async hapusPesanan(pesananId: string) {
    const pesanan = await prisma.pesanan.findUnique({ where: { id: pesananId } })
    if (!pesanan) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Pesanan tidak ditemukan')
    }

    await prisma.pesanan.delete({ where: { id: pesananId } })
    return { message: 'Pesanan berhasil dihapus' }
  }


  static async getLaporanBulanan(year: number, month: number) {
    const from = new Date(year, month - 1, 1)
    const to = new Date(year, month, 0, 23, 59, 59)

    const pesanan = await prisma.pesanan.findMany({
      where: {
        status: OrderStatus.selesai,
        createdAt: { gte: from, lte: to },
      },
      include: {
        details: true,
        seller: { select: { id: true, storeName: true } },
      },
    })

    const totalPendapatan = pesanan.reduce((sum, p) => sum + p.totalPrice, 0)
    const totalPesanan = pesanan.length
    const totalItem = pesanan.reduce(
      (sum, p) => sum + p.details.reduce((s, d) => s + d.quantity, 0),
      0
    )

    // Pendapatan per seller
    const perSeller = pesanan.reduce<Record<string, { storeName: string; total: number; jumlahPesanan: number }>>(
      (acc, p) => {
        const key = p.sellerId
        if (!acc[key]) {
          acc[key] = { storeName: p.seller.storeName ?? p.seller.id, total: 0, jumlahPesanan: 0 }
        }
        acc[key].total += p.totalPrice
        acc[key].jumlahPesanan += 1
        return acc
      },
      {}
    )

    return {
      periode: { year, month, from, to },
      summary: { totalPendapatan, totalPesanan, totalItem },
      perSeller: Object.entries(perSeller).map(([sellerId, data]) => ({ sellerId, ...data })),
    }
  }

  static async getMenuTerlaris(limit = 10) {
    const result = await prisma.detailPesanan.groupBy({
      by: ['menuId', 'menuName'],
      _sum: { quantity: true },
      _count: { menuId: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    })

    return result.map((item, index) => ({
      rank: index + 1,
      menuId: item.menuId,
      menuName: item.menuName,
      totalTerjual: item._sum.quantity ?? 0,
      totalPesanan: item._count.menuId,
    }))
  }

  static async getRiwayatTransaksiTerakhir(limit = 20) {
    return prisma.pesanan.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, name: true, avatar: true } },
        seller: { select: { id: true, storeName: true } },
        details: {
          select: {
            menuName: true,
            quantity: true,
            subtotal: true,
          },
        },
      },
    })
  }

  static async getDashboardSummary() {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const [
      totalPengguna,
      totalPenjual,
      pesananHariIni,
      pendapatanHariIni,
      ringkasanStatus,
    ] = await Promise.all([
      // Total customer
      prisma.user.count({ where: { role: 'customer' } }),

      // Total seller
      prisma.user.count({ where: { role: 'seller' } }),

      // Pesanan hari ini (semua status)
      prisma.pesanan.count({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
      }),

      // Pendapatan hari ini (hanya status selesai)
      prisma.pesanan.aggregate({
        where: {
          status: OrderStatus.selesai,
          createdAt: { gte: todayStart, lte: todayEnd },
        },
        _sum: { totalPrice: true },
      }),

      prisma.pesanan.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ])

    const statusMap = Object.values(OrderStatus).reduce<Record<string, number>>(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {}
    )
    for (const item of ringkasanStatus) {
      statusMap[item.status] = item._count.status
    }

    return {
      totalPengguna,
      totalPenjual,
      pesananHariIni,
      pendapatanHariIni: pendapatanHariIni._sum.totalPrice ?? 0,
      ringkasanStatus: statusMap,
    }
  }

  static async getGrafikPesananMingguan() {
    // Ambil 7 hari ke belakang dari hari ini
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
          where: { createdAt: { gte: start, lte: end } },
        })

        return {
          tanggal: day.toISOString().split('T')[0],
          hari: day.toLocaleDateString('id-ID', { weekday: 'long' }),
          hariPendek: day.toLocaleDateString('id-ID', { weekday: 'short' }),
          jumlahPesanan: count,
        }
      })
    )

    return results
  }
}

export default AdminService
