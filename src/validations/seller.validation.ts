import { z } from 'zod'
import { MenuCategory, OrderStatus } from '@/generated/prisma/client.js'

export const menuIdParam = z.object({
  menuId: z.uuid('menuId harus berupa UUID'),
})
export type MenuIdParam = z.infer<typeof menuIdParam>

export const pesananIdParam = z.object({
  pesananId: z.uuid('pesananId harus berupa UUID'),
})
export type PesananIdParam = z.infer<typeof pesananIdParam>

export const tambahMenuSchema = z.object({
  name: z.string().min(2, 'Nama menu minimal 2 karakter'),
  description: z.string().optional(),
  price: z.number().int().positive('Harga harus lebih dari 0'),
  category: z.enum(MenuCategory, { message: 'Kategori tidak valid' }),
  image: z.string().optional(),
  isAvailable: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
})
export type TambahMenuBody = z.infer<typeof tambahMenuSchema>

export const editMenuSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().int().positive().optional(),
  category: z.enum(MenuCategory).optional(),
  image: z.string().optional(),
  isAvailable: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
})
export type EditMenuBody = z.infer<typeof editMenuSchema>

export const getMenuQuerySchema = z.object({
  category: z.enum(MenuCategory).optional(),
})
export type GetMenuQuery = z.infer<typeof getMenuQuerySchema>

export const getPesananQuerySchema = z.object({
  status: z.enum(OrderStatus).optional(),
})
export type GetPesananQuery = z.infer<typeof getPesananQuerySchema>

export const updateStatusPesananSchema = z.object({
  status: z.enum(OrderStatus, { message: 'Status tidak valid' }),
})
export type UpdateStatusPesananBody = z.infer<typeof updateStatusPesananSchema>

export const getLaporanQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  status: z.enum(OrderStatus).optional(),
})
export type GetLaporanQuery = z.infer<typeof getLaporanQuerySchema>

export const updateSellerTenantSchema = z.object({
  storeName:   z.string().min(3).optional(),
  description: z.string().nullable().optional(),
  location:    z.string().min(3).optional(),
  isOpen:      z.boolean().optional(),
  openLabel:   z.string().optional(),
  logo:        z.string().optional(),
  image:       z.string().optional(),
  qrisImage:   z.string().optional(),
})
export type UpdateSellerTenantBody = z.infer<typeof updateSellerTenantSchema>


export const getSemuaPesananQuerySchema = z.object({
  status: z.enum(OrderStatus).optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(20).default(10).optional(),
});

export type GetSemuaPesananQuery = z.infer<typeof getSemuaPesananQuerySchema>
