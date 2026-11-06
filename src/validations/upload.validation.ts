import { z } from 'zod';
import { config } from '@/config/config.js';
import { UPLOAD_PURPOSE_KEYS } from '@/config/upload.js';

export const signatureSchema = z.object({
  purpose: z.enum(UPLOAD_PURPOSE_KEYS, { message: 'Jenis upload tidak valid' }),
});
export type SignatureBody = z.infer<typeof signatureSchema>;

/**
 * Nilai kolom gambar di database hanya boleh kalau:
 *  - URL Cloudinary milik cloud kita (hasil upload lewat endpoint signature), atau
 *  - path statis lokal diawali "/" (data lama / seed, mis. "/kantinBunda/tenant/x.png").
 * Selain itu ditolak, supaya URL sembarang (javascript:, situs lain, dsb.) tidak tersimpan.
 */
export const isAllowedImageRef = (value: string): boolean => {
  if (value.startsWith('/')) {
    return !value.startsWith('//') && !value.includes('..') && value.length <= 300;
  }
  const prefix = `https://res.cloudinary.com/${config.cloudinary.cloudName}/image/upload/`;
  return value.length <= 1000 && value.startsWith(prefix);
};

/**
 * Skema reusable untuk kolom gambar di db.
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
