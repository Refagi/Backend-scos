import type { Context } from 'hono'
import { catchAsync } from '@/utils/catchAsync.js'
import { ApiError } from '@/utils/ApiError.js'
import httpStatusCode from 'http-status-codes'
import { NotifikasiService } from '../services/notifikasi.service'
import type { User } from '@/models/user.model.js'

class NotifikasiController {

  // GET /notifications
  // Ambil semua notifikasi user (50 terbaru) — untuk initial load
  static getDaftar = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    const notifs = await NotifikasiService.getDaftarNotifikasi(user.id)
    return c.json({ status: httpStatusCode.OK, data: notifs })
  })

  // GET /notifications/unread-count
  // Hanya jumlah badge counter — ringan, bisa di-poll jika perlu
  static getJumlahBelumDibaca = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    const count = await NotifikasiService.getJumlahBelumDibaca(user.id)
    return c.json({ status: httpStatusCode.OK, data: { count } })
  })

  // PATCH /notifications/:notifId/read
  // Tandai satu notifikasi sudah dibaca
  static tandaiDibaca = catchAsync(async (c: Context) => {
    const user    = c.get('user') as User
    const notifId = c.req.param('notifId')
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    await NotifikasiService.tandaiDibaca(notifId, user.id)
    return c.json({ status: httpStatusCode.OK, message: 'Notifikasi ditandai sudah dibaca' })
  })

  // PATCH /notifications/read-all
  // Tandai semua notifikasi sudah dibaca
  static tandaiSemuaDibaca = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    await NotifikasiService.tandaiSemuaDibaca(user.id)
    return c.json({ status: httpStatusCode.OK, message: 'Semua notifikasi ditandai sudah dibaca' })
  })

  // DELETE /notifications
  // Hapus semua notifikasi user
  static hapusSemua = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    await NotifikasiService.hapusSemua(user.id)
    return c.json({ status: httpStatusCode.OK, message: 'Semua notifikasi dihapus' })
  })
}

export default NotifikasiController
