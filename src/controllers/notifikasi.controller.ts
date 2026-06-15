import type { Context } from 'hono'
import { catchAsync } from '@/utils/catchAsync.js'
import { ApiError } from '@/utils/ApiError.js'
import httpStatusCode from 'http-status-codes'
import { NotifikasiService } from '../services/notifikasi.service.js'
import { type TandaiDibacaParams} from '@/validations/notifikasi.validation.js'
import type { User } from '@/models/user.model.js'

class NotifikasiController {

  static getDaftar = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    const notifs = await NotifikasiService.getDaftarNotifikasi(user.id)
    return c.json({ status: httpStatusCode.OK, data: notifs })
  })

  static getJumlahBelumDibaca = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    const count = await NotifikasiService.getJumlahBelumDibaca(user.id)
    return c.json({ status: httpStatusCode.OK, data: { count } })
  })

  static tandaiDibaca = catchAsync(async (c: Context) => {
    const user    = c.get('user') as User
    const param = c.get('parsedParam') as TandaiDibacaParams
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    await NotifikasiService.tandaiDibaca(param.notifId, user.id)
    return c.json({ status: httpStatusCode.OK, message: 'Notifikasi ditandai sudah dibaca' })
  })

  static tandaiSemuaDibaca = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    await NotifikasiService.tandaiSemuaDibaca(user.id)
    return c.json({ status: httpStatusCode.OK, message: 'Semua notifikasi ditandai sudah dibaca' })
  })

  static hapusSemua = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    await NotifikasiService.hapusSemua(user.id)
    return c.json({ status: httpStatusCode.OK, message: 'Semua notifikasi dihapus' })
  })
}

export default NotifikasiController
