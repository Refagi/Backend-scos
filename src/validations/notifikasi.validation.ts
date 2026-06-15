import { z } from 'zod';
import type { Role, NotifType } from '@/generated/prisma/client';

export const CreateNotifSchema = z.object({
  userId:    z.string().min(1, 'userId wajib diisi'),
  role:      z.enum(['admin', 'seller', 'customer']),
  title:     z.string().min(3, 'Title minimal 3 karakter').max(150),
  message:   z.string().min(5, 'Message minimal 5 karakter').max(500),
  type:      z.enum(['info', 'success', 'warning', 'error']).default('info'),
  pesananId: z.string().optional().nullable(),
  menuId:    z.string().optional().nullable(),
});

export const TandaiDibacaSchema = z.object({
  notifId: z.string().min(1, 'notifId wajib diisi'),
});

export const ParamsNotifIdSchema = z.object({
  notifId: z.string().min(1, 'notifId tidak boleh kosong'),
});

export type CreateNotifParams = z.infer<typeof CreateNotifSchema>;
export type TandaiDibacaParams = z.infer<typeof TandaiDibacaSchema>;
