import { Hono } from 'hono';
import { UploadController } from '@/controllers/index.js';
import { auth } from '@/middlewares/auth.js';
import { validateMiddlewares } from '@/middlewares/validate.js';
import { signatureSchema } from '@/validations/upload.validation.js';

const uploadRoute = new Hono();

uploadRoute.post(
  '/signature',
  auth(['admin', 'seller', 'customer']),
  validateMiddlewares.validateJson(signatureSchema),
  UploadController.createSignature
);

export default uploadRoute;
