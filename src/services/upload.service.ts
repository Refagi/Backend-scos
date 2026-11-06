import httpStatusCode from 'http-status-codes';
import { config } from '@/config/config.js';
import { ApiError } from '@/utils/ApiError.js';
import { signCloudinaryParams } from '@/utils/cloudinarySign.js';
import {
  IMAGE_ALLOWED_FORMATS,
  IMAGE_MAX_BYTES,
  UPLOAD_PURPOSES,
  type UploadPurpose,
} from '@/config/upload.js';

class UploadService {
  /**
   * Menghasilkan parameter bertanda tangan biar browser bisa upload langsung ke Cloudinary.
   * `folder` dan `allowed_formats` ikut ditandatangani, jadi tidak bisa diubah oleh klien.
   */
  static createSignature(role: string, purpose: UploadPurpose) {
    const rule = UPLOAD_PURPOSES[purpose];
    if (!rule.roles.some((r) => r === role)) {
      throw new ApiError(httpStatusCode.FORBIDDEN, 'Anda tidak memiliki akses untuk mengupload jenis gambar ini');
    }

    const { cloudName, apiKey, apiSecret } = config.cloudinary;

    const params = {
      allowed_formats: IMAGE_ALLOWED_FORMATS.join(','),
      folder: rule.folder,
      timestamp: Math.floor(Date.now() / 1000),
    };

    return {
      cloudName,
      apiKey,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      params: { ...params, signature: signCloudinaryParams(params, apiSecret) },
      allowedFormats: [...IMAGE_ALLOWED_FORMATS],
      maxFileSize: IMAGE_MAX_BYTES,
    };
  }
}

export default UploadService;
