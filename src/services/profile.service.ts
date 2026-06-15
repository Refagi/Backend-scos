import prisma from '@/../prisma/client.js'
import { ApiError } from '@/utils/ApiError'
import httpStatusCode from 'http-status-codes'
import bcrypt from 'bcryptjs'
import type { UpdateProfileBody, ChangePasswordBody } from '@/validations/profile.validation'

export class ProfileService {

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, status: true, avatar: true,
        storeName: true, description: true, location: true,
        isOpen: true, openLabel: true, logo: true,
        image: true, qrisImage: true,
        createdAt: true, updatedAt: true,
      },
    })
    if (!user) throw new ApiError(httpStatusCode.NOT_FOUND, 'Akun tidak ditemukan')
    return user
  }

  static async updateProfile(userId: string, body: UpdateProfileBody) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new ApiError(httpStatusCode.NOT_FOUND, 'Akun tidak ditemukan')

    if (body.email && body.email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: body.email } })
      if (existing) throw new ApiError(httpStatusCode.CONFLICT, 'Email sudah digunakan')
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
        isOpen: true, openLabel: true, qrisImage: true,
        updatedAt: true,
      },
    })
  }

  static async changePassword(userId: string, body: ChangePasswordBody) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new ApiError(httpStatusCode.NOT_FOUND, 'Akun tidak ditemukan')

    const match = await bcrypt.compare(body.currentPassword, user.password!);
    if (!match) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Kata sandi saat ini salah')

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(body.newPassword, salt);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, updatedAt: new Date() },
    })

    return { message: 'Kata sandi berhasil diperbarui' }
  }
}
