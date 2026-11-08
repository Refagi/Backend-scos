/**
 * Aturan upload gambar (dipakai backend untuk menandatangani upload ke Cloudinary).
 * Nilai ini juga dikirim ke frontend lewat endpoint signature, jadi cukup diubah di sini.
 */

export const IMAGE_ALLOWED_FORMATS = ['png', 'jpg', 'jpeg'] as const;

export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export const UPLOAD_PURPOSE_KEYS = ['avatar', 'tenant', 'qris', 'menu', 'payment_proof'] as const;
export type UploadPurpose = (typeof UPLOAD_PURPOSE_KEYS)[number];

type UploadRole = 'admin' | 'seller' | 'customer';

/** Setiap jenis upload punya folder sendiri di Cloudinary dan daftar role yang boleh memakainya. */
export const UPLOAD_PURPOSES: Record<UploadPurpose, { folder: string; roles: readonly UploadRole[] }> = {
  avatar: { folder: 'scos/avatar', roles: ['admin', 'seller', 'customer'] },
  tenant: { folder: 'scos/tenant', roles: ['admin', 'seller'] },
  qris:   { folder: 'scos/qris',   roles: ['admin', 'seller'] },
  menu:   { folder: 'scos/menu',   roles: ['admin', 'seller'] },
  // Bukti pembayaran QRIS: hanya customer yang boleh mengupload.
  payment_proof: { folder: 'scos/bukti-bayar', roles: ['customer'] },
};
