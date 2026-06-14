import { z } from 'zod'

export const updateProfileSchema = z.object({
  name:  z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(9).optional(),
  // seller only
  storeName:   z.string().min(3).optional(),
  description: z.string().nullable().optional(),
  location:    z.string().min(3).optional(),
  isOpen:      z.boolean().optional(),
  openLabel:   z.string().optional(),
  qrisImage:   z.string().optional(),
})
export type UpdateProfileBody = z.infer<typeof updateProfileSchema>

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  newPassword:     z.string().min(8, { message: 'Password must be at least 8 characters' }).refine(
    (password) => /[A-Za-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password),
    { message: 'Password must contain at least 1 letter, 1 number, and 1 special character'}),
})
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>

