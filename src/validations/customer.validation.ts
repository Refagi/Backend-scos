import { z } from 'zod';
import { MenuCategory, OrderStatus } from '@/generated/prisma/client.js';

export const sellerIdParam = z.object({
  sellerId: z.uuid('sellerId harus berupa UUID'),
});
export type SellerIdParam = z.infer<typeof sellerIdParam>;

export const pesananIdParam = z.object({
  pesananId: z.uuid('pesananId harus berupa UUID'),
});
export type PesananIdParam = z.infer<typeof pesananIdParam>;

export const getMenuSellerQuerySchema = z.object({
  category: z.enum(MenuCategory).optional(),
});
export type GetMenuSellerQuery = z.infer<typeof getMenuSellerQuerySchema>;

export const getRiwayatPesananQuerySchema = z.object({
  status: z.enum(OrderStatus).optional(),
});
export type GetRiwayatPesananQuery = z.infer<
  typeof getRiwayatPesananQuerySchema
>;

export const buatPesananSchema = z.object({
  sellerId: z.uuid('sellerId harus berupa UUID'),
  slot: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        menuId: z.uuid('menuId harus berupa UUID'),
        quantity: z.number().int().positive('Quantity harus lebih dari 0'),
        notes: z.string().optional(),
      })
    )
    .min(1, 'Minimal 1 item pesanan'),
});
export type BuatPesananBody = z.infer<typeof buatPesananSchema>;
