import prisma from '@/../prisma/client.js'
import { sseManager, type NotifPayload } from '@/utils/sseManager.js'
import type { Role, NotifType } from '@/generated/prisma/client.js'
import type { CreateNotifParams } from '@/models/notifikasi.model.js'


export class NotifikasiService {

  // ── Buat notif di DB lalu langsung push ke SSE (jika user online) ──────────
  static async kirim(params: CreateNotifParams): Promise<void> {
    const notif = await prisma.notifikasi.create({
      data: {
        userId:    params.userId,
        role:      params.role,
        title:     params.title,
        message:   params.message,
        type:      params.type ?? 'info',
        pesananId: params.pesananId,
        menuId:    params.menuId,
        isRead:    false,
      },
    })

    // Push real-time — jika user offline, notif sudah tersimpan di DB
    // dan akan di-load saat user buka halaman/login
    const payload: NotifPayload = {
      id:        notif.id,
      userId:    notif.userId,
      role:      notif.role,
      title:     notif.title,
      message:   notif.message,
      type:      notif.type,
      isRead:    notif.isRead,
      pesananId: notif.pesananId,
      menuId:    notif.menuId,
      createdAt: notif.createdAt,
    }

    sseManager.sendToUser(params.userId, payload)
  }

  //  Kirim ke semua seller sekaligus (misal: broadcast pengumuman)
  static async kirimKeRole(role: Role, params: Omit<CreateNotifParams, 'userId' | 'role'>): Promise<void> {
    const users = await prisma.user.findMany({ where: { role }, select: { id: true } })
    await Promise.all(users.map((u) => NotifikasiService.kirim({ ...params, userId: u.id, role })))
  }

  // Ambil semua notif user (untuk initial load saat halaman dibuka)
  static async getDaftarNotifikasi(userId: string) {
    return prisma.notifikasi.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
      take:    50,
    })
  }

  // Ambil hanya yang belum dibaca (untuk badge counter)
  static async getJumlahBelumDibaca(userId: string): Promise<number> {
    return prisma.notifikasi.count({ where: { userId, isRead: false } })
  }

  // Tandai satu notifikasi sudah dibaca
  static async tandaiDibaca(notifId: string, userId: string) {
    return prisma.notifikasi.updateMany({
      where: { id: notifId, userId },
      data:  { isRead: true },
    })
  }

  // Tandai semua notifikasi user sudah dibaca
  static async tandaiSemuaDibaca(userId: string) {
    return prisma.notifikasi.updateMany({
      where: { userId, isRead: false },
      data:  { isRead: true },
    })
  }

  // Hapus notifikasi (opsional, untuk "clear all")
  static async hapusSemua(userId: string) {
    return prisma.notifikasi.deleteMany({ where: { userId } })
  }
}

export async function notifPesananBaru(params: {
  sellerId: string
  customerName: string
  orderNumber: string
  pesananId: string
  ringkasanMenu: string
}) {
  await NotifikasiService.kirim({
    userId:    params.sellerId,
    role:      'seller',
    title:     'Pesanan Baru Masuk!',
    message:   `${params.customerName} — ${params.ringkasanMenu} (${params.orderNumber})`,
    type:      'info',
    pesananId: params.pesananId,
  })
}

export async function notifPembayaranDikirim(params: {
  sellerId:    string
  pesananId:   string
  orderNumber: string
  sellerName:  string
}) {
  await NotifikasiService.kirim({
    userId:    params.sellerId,
    role:      'seller',
    title:     'Customer Sudah Transfer!',
    message:   `Pesanan ${params.orderNumber} — customer mengklaim sudah transfer. Cek saldo kamu ya!`,
    type:      'success',
    pesananId: params.pesananId,
  })
}

export async function notifStatusBerubah(params: {
  customerId: string
  orderNumber: string
  pesananId: string
  status: string
  sellerName: string
}) {
  type StatusConfig = { title: string; message: string; type: NotifType }

  const config: Record<string, StatusConfig> = {
    diterima: {
      title:   'Pesanan Diterima',
      message: `${params.sellerName} sedang mempersiapkan pesanan ${params.orderNumber}`,
      type:    'info',
    },
    dimasak: {
      title:   'Pesanan Sedang Dimasak',
      message: `Pesanan ${params.orderNumber} kini sedang disiapkan`,
      type:    'info',
    },
    siap: {
      title:   'Pesanan Siap Diambil!',
      message: `Pesanan ${params.orderNumber} sudah siap. Silakan ambil di ${params.sellerName}`,
      type:    'success',
    },
    selesai: {
      title:   'Pesanan Selesai',
      message: `Pesanan ${params.orderNumber} telah selesai. Terima kasih!`,
      type:    'success',
    },
    ditolak: {
      title:   'Pesanan Ditolak',
      message: `Maaf, pesanan ${params.orderNumber} ditolak oleh ${params.sellerName}`,
      type:    'error',
    },
  }

  const cfg = config[params.status]
  if (!cfg) return

  await NotifikasiService.kirim({
    userId:    params.customerId,
    role:      'customer',
    title:     cfg.title,
    message:   cfg.message,
    type:      cfg.type,
    pesananId: params.pesananId,
  })
}
