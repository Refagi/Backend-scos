import { z } from 'zod';
import { MenuCategory, OrderStatus, OrderType, PaymentMethod } from '@/generated/prisma/client.js';
import { paymentProofSchema } from './upload.validation.js';

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

/** Nomor meja diisi manual oleh pembeli (mis. "5", "A12", "VIP-2"). Disimpan huruf besar. */
export const tableNumberSchema = z
  .string()
  .trim()
  .min(1, 'Nomor meja wajib diisi')
  .max(10, 'Nomor meja maksimal 10 karakter')
  .regex(/^[A-Za-z0-9][A-Za-z0-9 \-/]*$/, 'Nomor meja hanya boleh berisi huruf, angka, spasi, atau tanda -')
  .transform((v) => v.toUpperCase());

export const buatPesananSchema = z.object({
  sellerId: z.uuid('sellerId harus berupa UUID'),
  slot: z.string().optional(),
  notes: z.string().optional(),
  // Default = perilaku lama, supaya klien lama (belum update) tetap bisa memesan.
  orderType: z.enum(OrderType, { message: 'Tipe pesanan tidak valid' }).default('takeaway'),
  paymentMethod: z.enum(PaymentMethod, { message: 'Metode pembayaran tidak valid' }).default('qris'),
  tableNumber: z
    .preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), tableNumberSchema)
    .optional(),
  items: z
    .array(
      z.object({
        menuId: z.uuid('menuId harus berupa UUID'),
        quantity: z.number().int().positive('Quantity harus lebih dari 0'),
        notes: z.string().optional(),
      })
    )
    .min(1, 'Minimal 1 item pesanan'),
}).superRefine((val, ctx) => {
  if (val.orderType === 'dine_in' && !val.tableNumber) {
    ctx.addIssue({ code: 'custom', path: ['tableNumber'], message: 'Nomor meja wajib diisi untuk pesanan Dine In' });
  }
});
export type BuatPesananBody = z.infer<typeof buatPesananSchema>;

export const konfirmasiBayarSchema = z.object({
  paymentProof: paymentProofSchema,
});
export type KonfirmasiBayarBody = z.infer<typeof konfirmasiBayarSchema>;
