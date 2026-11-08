import { z } from 'zod';
import { config } from '@/config/config.js';
import { UPLOAD_PURPOSE_KEYS, UPLOAD_PURPOSES } from '@/config/upload.js';

export const signatureSchema = z.object({
  purpose: z.enum(UPLOAD_PURPOSE_KEYS, { message: 'Jenis upload tidak valid' }),
});
export type SignatureBody = z.infer<typeof signatureSchema>;

export const isAllowedImageRef = (value: string): boolean => {
  if (value.startsWith('/')) {
    return !value.startsWith('//') && !value.includes('..') && value.length <= 300;
  }
  const prefix = `https://res.cloudinary.com/${config.cloudinary.cloudName}/image/upload/`;
  return value.length <= 1000 && value.startsWith(prefix);
};

/**
 * Skema reusable untuk kolom gambar.
 *  - undefined -> tidak diubah
 *  - null atau "" -> gambar dihapus (disimpan sebagai null)
 *  - string -> harus lolos isAllowedImageRef
 */
export const imageField = z
  .preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? null : v),
    z.string().refine(isAllowedImageRef, { message: 'URL gambar tidak valid' }).nullable()
  )
  .optional();

/**
 * Bukti pembayaran harus berupa URL Cloudinary di folder khusus bukti bayar,
 * artinya benar-benar hasil upload lewat endpoint signature (purpose "payment_proof").
 */
export const isPaymentProofRef = (value: string): boolean => {
  const prefix = `https://res.cloudinary.com/${config.cloudinary.cloudName}/image/upload/`;
  return (
    value.length <= 1000 &&
    value.startsWith(prefix) &&
    value.includes(`/${UPLOAD_PURPOSES.payment_proof.folder}/`)
  );
};

export const paymentProofSchema = z
  .string({ message: 'Bukti pembayaran wajib diupload' })
  .refine(isPaymentProofRef, { message: 'Bukti pembayaran tidak valid. Upload ulang gambar bukti pembayaran.' });
