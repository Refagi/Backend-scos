import { z } from 'zod'
import { Role, UserStatus, OrderStatus, MenuCategory } from '@/generated/prisma/client.js'


export const userIdParam = z.object({
  userId: z.uuid('userId harus berupa UUID'),
})
export type UserIdParam = z.infer<typeof userIdParam>

export const menuIdParam = z.object({
  menuId: z.uuid('menuId harus berupa UUID'),
})
export type MenuIdParam = z.infer<typeof menuIdParam>

export const pesananIdParam = z.object({
  pesananId: z.uuid('pesananId harus berupa UUID'),
})
export type PesananIdParam = z.infer<typeof pesananIdParam>



export const tambahAkunSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.email('Format email tidak valid'),
  phone: z.string().min(9, 'Nomor HP tidak valid').optional(),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(Role, { message: 'Role tidak valid' }),
  status: z.enum(UserStatus).optional(),
  // seller only
  storeName: z.string().min(3, 'Nama toko minimal 3 karakter').optional(),
  description: z.string().optional(),
  location: z.string().min(3, 'Lokasi minimal 3 karakter').optional(),
  isOpen: z.boolean().optional(),
  openLabel: z.string().optional(),
  qrisImage: z.string().optional(),
}).refine(data => {
  if (data.role === Role.seller) {
    return !!data.storeName && !!data.location
  }
  return true
}, {
  message: 'storeName dan location wajib diisi untuk role seller',
  path: ['storeName'],
})
export type TambahAkunBody = z.infer<typeof tambahAkunSchema>

export const editAkunSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  phone: z.string().min(9).optional(),
  status: z.enum(UserStatus).optional(),
  // seller only
  storeName: z.string().min(3).optional(),
  description: z.string().optional(),
  location: z.string().min(3).optional(),
  isOpen: z.boolean().optional(),
  openLabel: z.string().optional(),
  qrisImage: z.string().optional(),
})
export type EditAkunBody = z.infer<typeof editAkunSchema>

export const getDaftarAkunQuerySchema = z.object({
  role: z.enum(Role).optional(),
  status: z.enum(UserStatus).optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(20).default(10).optional(),
})
export type GetDaftarAkunQuery = z.infer<typeof getDaftarAkunQuerySchema>


export const createMenuSchema = z.object({
  sellerId: z.uuid('Seller ID tidak valid'),
  name: z.string().min(3, 'Nama menu minimal 3 karakter').max(150),
  description: z.string().max(500).optional(),
  price: z.number().int().positive('Harga harus lebih dari 0'),
  category: z.enum(MenuCategory),
  image: z.url('Image harus berupa URL yang valid').optional().or(z.literal('')),
  stock: z.number().int().min(0).optional().default(0),
  isAvailable: z.boolean().optional().default(true),
})

export type CreateMenuInput = z.infer<typeof createMenuSchema>

export const editMenuSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().int().positive('Harga harus lebih dari 0').optional(),
  category: z.enum(MenuCategory).optional(),
  image: z.string().optional(),
  isAvailable: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
})
export type EditMenuBody = z.infer<typeof editMenuSchema>

export const getSemuaMenuQuerySchema = z.object({
  sellerId: z.uuid().optional(),
  category: z.enum(MenuCategory).optional(),
})
export type GetSemuaMenuQuery = z.infer<typeof getSemuaMenuQuerySchema>




export const getSemuaPesananQuerySchema = z.object({
  status: z.enum(OrderStatus).optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(20).default(10).optional(),
});

export type GetSemuaPesananQuery = z.infer<typeof getSemuaPesananQuerySchema>;

export const updateStatusPesananSchema = z.object({
  status: z.enum(OrderStatus, { message: 'Status tidak valid' }),
})
export type UpdateStatusPesananBody = z.infer<typeof updateStatusPesananSchema>




export const laporanBulananQuerySchema = z.object({
  year: z.string().optional().transform(v => v ? Number(v) : new Date().getFullYear()),
  month: z.string().optional().transform(v => v ? Number(v) : new Date().getMonth() + 1),
}).refine(data => data.month >= 1 && data.month <= 12, {
  message: 'Bulan harus antara 1 sampai 12',
  path: ['month'],
})
export type LaporanBulananQuery = z.infer<typeof laporanBulananQuerySchema>

export const limitQuerySchema = z.object({
  limit: z.string().optional().transform(v => v ? Number(v) : undefined),
})
export type LimitQuery = z.infer<typeof limitQuerySchema>


