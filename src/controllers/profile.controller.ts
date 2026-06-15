import type { Context } from 'hono'
import { catchAsync } from '@/utils/catchAsync.js'
import httpStatusCode from 'http-status-codes';
import { ProfileService } from '@/services/profile.service.js'
import type { UpdateProfileBody, ChangePasswordBody } from '@/validations/profile.validation.js'
import type { User } from '@/models/token.model.js';

export class ProfileController {

  static getProfile = catchAsync(async (c: Context) => {
    const userId = c.get('userId') as string
    const data = await ProfileService.getProfile(userId)
    return c.json({ status: httpStatusCode.OK, data })
  })

  static updateProfile = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    const body = c.get('parsedJson') as UpdateProfileBody
    const data = await ProfileService.updateProfile(user.id, body)
    return c.json({ status: httpStatusCode.OK, message: 'Profil berhasil diperbarui', data })
  })

  static changePassword = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    const body = c.get('parsedJson') as ChangePasswordBody
    const result = await ProfileService.changePassword(user.id, body)
    return c.json({ status: httpStatusCode.OK, message: result.message })
  })
}
