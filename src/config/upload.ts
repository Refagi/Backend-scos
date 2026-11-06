/**
 * Aturan upload gambar (dipakai backend untuk menandatangani upload ke Cloudinary).
 * Nilai ini juga dikirim ke frontend lewat endpoint signature, jadi cukup diubah di sini.
 */

/** Format yang diizinkan. Ditegakkan oleh Cloudinary lewat parameter `allowed_formats`. */
export const IMAGE_ALLOWED_FORMATS = ['png', 'jpg', 'jpeg'] as const;

/**
 * Ukuran maksimum per file: 10 MB.
 * Sama dengan batas file gambar paket gratis Cloudinary, jadi aman tanpa perlu upgrade.
 */
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export const UPLOAD_PURPOSE_KEYS = ['avatar', 'tenant', 'qris', 'menu'] as const;
export type UploadPurpose = (typeof UPLOAD_PURPOSE_KEYS)[number];

type UploadRole = 'admin' | 'seller' | 'customer';

/** Setiap jenis upload punya folder sendiri di Cloudinary dan daftar role yang boleh memakainya. */
export const UPLOAD_PURPOSES: Record<UploadPurpose, { folder: string; roles: readonly UploadRole[] }> = {
  avatar: { folder: 'scos/avatar', roles: ['admin', 'seller', 'customer'] },
  tenant: { folder: 'scos/tenant', roles: ['admin', 'seller'] },
  qris:   { folder: 'scos/qris',   roles: ['admin', 'seller'] },
  menu:   { folder: 'scos/menu',   roles: ['admin', 'seller'] },
};
