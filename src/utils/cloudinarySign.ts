import { createHash } from 'node:crypto';

/**
 * docs
 * Membuat signature untuk upload Cloudinary.
 * Aturannya: urutkan parameter berdasarkan nama, gabungkan "k=v" dengan "&",
 * tambahkan API secret di akhir, lalu SHA-1 (hex).
 * `file`, `api_key`, `resource_type`, dan `cloud_name` TIDAK ikut ditandatangani.
 */
export function signCloudinaryParams(
  params: Record<string, string | number>,
  apiSecret: string
): string {
  const toSign = Object.entries(params)
    .filter(([, value]) => value !== '' && value !== undefined && value !== null)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return createHash('sha1').update(toSign + apiSecret).digest('hex');
}
