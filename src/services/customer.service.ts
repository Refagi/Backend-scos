import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import {
  Prisma,
  OrderStatus,
  MenuCategory,
} from '@/generated/prisma/client.js';
import type {
  UpdateOrderStatusInput,
  CreatePesananInput,
} from '@/models/order.model.js';
import type { CreateMenuInput, UpdateMenuInput } from '@/models/menu.model.js';
import { nanoid } from 'nanoid';
import { notifPesananBaru, notifPembayaranDikirim } from './notifikasi.service.js';

class CustomerService {
  static async getDaftarSeller() {
    return prisma.user.findMany({
      where: { role: 'seller', status: 'active' },
      select: {
        id: true,
        name: true,
        storeName: true,
        description: true,
        location: true,
        isOpen: true,
        openLabel: true,
        logo: true,
        image: true,
        qrisImage: true,
      },
      orderBy: { storeName: 'asc' },
    });
  }

  static async getMenuSeller(sellerId: string, category?: MenuCategory) {
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      select: {
        id: true,
        name: true,
        storeName: true,
        description: true,
        location: true,
        isOpen: true,
        openLabel: true,
        logo: true,
        image: true,
        qrisImage: true,
      },
    });

    if (!seller) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Seller tidak ditemukan');
    }

    const menus = await prisma.menu.findMany({
      where: {
        sellerId,
        isAvailable: true,
        ...(category && { category }),
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    return { seller, menus };
  }

  static async buatPesanan(customerId: string, body: CreatePesananInput) {
    const seller = await prisma.user.findUnique({
      where: { id: body.sellerId },
      select: { id: true, isOpen: true, storeName: true },
    });
    if (!seller) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Seller tidak ditemukan');
    }
    if (!seller.isOpen) {
      throw new ApiError(
        httpStatusCode.BAD_REQUEST,
        `${seller.storeName} sedang tutup`
      );
    }

    const menuIds = body.items.map(i => i.menuId);
    const menus = await prisma.menu.findMany({
      where: {
        id: { in: menuIds },
        sellerId: body.sellerId,
        isAvailable: true,
      },
    });

    if (menus.length !== menuIds.length) {
      throw new ApiError(
        httpStatusCode.BAD_REQUEST,
        'Beberapa menu tidak tersedia atau tidak ditemukan'
      );
    }

    const menuMap = new Map(menus.map(m => [m.id, m]));

    let totalPrice = 0;
    const details = body.items.map(item => {
      const menu = menuMap.get(item.menuId)!;
      const subtotal = menu.price * item.quantity;
      totalPrice += subtotal;
      return {
        menuId: item.menuId,
        menuName: menu.name,
        menuPrice: menu.price,
        quantity: item.quantity,
        subtotal,
        notes: item.notes,
      };
    });

    const orderNumber = `ORD-${nanoid(8).toUpperCase()}`;

    const pesanan = await prisma.$transaction(async tx => {
      return await tx.pesanan.create({
        data: {
          orderNumber,
          customerId,
          sellerId: body.sellerId,
          totalPrice,
          status: 'menunggu',
          slot: body.slot ?? null,
          notes: body.notes ?? null,
          details: {
            createMany: { data: details },
          },
        },
        include: {
          seller: {
            select: {
              id: true,
              storeName: true,
              location: true,
              qrisImage: true,
            },
          },
          details: {
            include: {
              menu: { select: { id: true, name: true, image: true } },
            },
          },
          customer: { select: { id: true, name: true } },
        },
      });
    });

    const ringkasanMenu = details
      .map(d => `${d.menuName} ×${d.quantity}`)
      .join(', ');

    await notifPesananBaru({
      sellerId: body.sellerId,
      customerName: pesanan.customer.name,
      orderNumber: pesanan.orderNumber,
      pesananId: pesanan.id,
      ringkasanMenu,
    });

    return pesanan;
  }

  static async cancelPesanan(customerId: string, pesananId: string) {
    const pesanan = await prisma.pesanan.findUnique({
      where: { id: pesananId },
    });
    if (!pesanan)
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Pesanan tidak ditemukan');
    if (pesanan.customerId !== customerId) {
      throw new ApiError(
        httpStatusCode.FORBIDDEN,
        'Anda tidak memiliki akses ke pesanan ini'
      );
    }
    if (pesanan.status !== 'menunggu') {
      throw new ApiError(
        httpStatusCode.BAD_REQUEST,
        `Pesanan tidak bisa dibatalkan karena statusnya sudah '${pesanan.status}'`
      );
    }

    return prisma.pesanan.update({
      where: { id: pesananId },
      data: { status: 'ditolak', updatedAt: new Date() },
    });
  }

  static async konfirmasiPembayaran(customerId: string, pesananId: string) {
    const pesanan = await prisma.pesanan.findUnique({
      where: { id: pesananId },
      include: { seller: { select: { id: true, storeName: true } } },
    });
    if (!pesanan)
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Pesanan tidak ditemukan');
    if (pesanan.customerId !== customerId) {
      throw new ApiError(
        httpStatusCode.FORBIDDEN,
        'Anda tidak memiliki akses ke pesanan ini'
      );
    }
    if (pesanan.status !== 'menunggu') {
      throw new ApiError(
        httpStatusCode.BAD_REQUEST,
        `Pesanan sudah dalam status '${pesanan.status}'`
      );
    }

    const updated = await prisma.pesanan.update({
      where: { id: pesananId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        status: pesanan.status === 'menunggu' ? 'diterima' : pesanan.status,
      },include: {
        customer: true,
        seller: true,
        details: true,
      }
    })

    await notifPembayaranDikirim({
      sellerId: pesanan.sellerId,
      pesananId: pesanan.id,
      orderNumber: pesanan.orderNumber,
      sellerName: pesanan.seller.storeName ?? 'Tenant',
    });

    return updated
  }

  static async getRiwayatPesanan(customerId: string, status?: OrderStatus) {
    return prisma.pesanan.findMany({
      where: {
        customerId,
        ...(status && { status }),
      },
      include: {
        seller: {
          select: { id: true, storeName: true, location: true, logo: true, qrisImage: true },
        },
        details: {
          select: {
            menuId: true,
            menuName: true,
            menuPrice: true,
            quantity: true,
            subtotal: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getDetailPesanan(customerId: string, pesananId: string) {
    const pesanan = await prisma.pesanan.findUnique({
      where: { id: pesananId },
      include: {
        seller: {
          select: {
            id: true,
            storeName: true,
            location: true,
            logo: true,
            qrisImage: true,
          },
        },
        details: {
          include: {
            menu: {
              select: { id: true, name: true, image: true, category: true },
            },
          },
        },
      },
    });

    if (!pesanan) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Pesanan tidak ditemukan');
    }
    if (pesanan.customerId !== customerId) {
      throw new ApiError(
        httpStatusCode.FORBIDDEN,
        'Anda tidak memiliki akses ke pesanan ini'
      );
    }

    return pesanan;
  }

  static async getRingkasanPesanan(customerId: string, pesananId: string) {
    const pesanan = await this.getDetailPesanan(customerId, pesananId);

    return {
      orderNumber: pesanan.orderNumber,
      status: pesanan.status,
      slot: pesanan.slot,
      notes: pesanan.notes,
      seller: pesanan.seller,
      items: pesanan.details.map(d => ({
        menuName: d.menuName,
        menuPrice: d.menuPrice,
        quantity: d.quantity,
        subtotal: d.subtotal,
        notes: d.notes,
      })),
      totalPrice: pesanan.totalPrice,
      createdAt: pesanan.createdAt,
    };
  }
}

export default CustomerService;
