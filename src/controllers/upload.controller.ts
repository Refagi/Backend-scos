import httpStatusCode from 'http-status-codes';
import type { Context } from 'hono';
import { catchAsync } from '@/utils/catchAsync.js';
import { UploadService } from '@/services/index.js';
import type { User } from '@/models/user.model.js';
import type { SignatureBody } from '@/validations/upload.validation.js';

class UploadController {
  static createSignature = catchAsync(async (c: Context) => {
    const user = c.get('user') as User;
    const { purpose } = c.get('parsedJson') as SignatureBody;

    const data = UploadService.createSignature(user.role, purpose);

    c.header('Cache-Control', 'no-store');
    return c.json({ status: httpStatusCode.StatusCodes.OK, data });
  });
}

export default UploadController;
