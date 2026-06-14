import { z } from 'zod'

export const register = z.object({
    name: z.string().min(5, { message: 'Name is required' }),
    email: z
      .email({ message: 'Email must be a valid email address' })
      .refine((email) => email.endsWith('@gmail.com'), { message: 'Email must end with @gmail.com' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .refine(
        (password) => /[A-Za-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password),
        {
          message: 'Password must contain at least 1 letter, 1 number, and 1 special character'
        }
      )
})

export const login =
    z.object({
    email: z
      .email({ message: 'Email must be a valid email address' })
      .refine((email) => email.endsWith('@gmail.com'), { message: 'Email must end with @gmail.com' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .refine(
        (password) => /[A-Za-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password),
        {
          message: 'Password must contain at least 1 letter, 1 number, and 1 special character'
        }
      )
  });

export const logout = z.object({
  refreshToken: z.string().min(1, { message: 'refresh token must exist!' })
})

export const verifyEmail =
  z.object({
    token: z.string().min(1, { message: 'verify token must exist!' })
})

export const forgotPassord = z.object({
    email: z
    .email({ message: 'Email must be a valid email address' })
    .refine((email) => email.endsWith('@gmail.com'), { message: 'Email must end with @gmail.com' }),
})

export const resetPassword = z.object({
  token: z.string().min(1, { message: 'verify token must exist!' }),
  newPassword:
  z.string()
  .min(12, { message: 'Password must be at least 12 characters' })
  .refine((password) => /[A-Za-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password),
  { message: 'Password must contain at least 1 letter, 1 number, and 1 special character'})
})

export const activateAccount = login;

export type LoginBody = z.infer<typeof login>;
export type LogoutBody = z.infer<typeof logout>;
export type VerifyEmailBody = z.infer<typeof verifyEmail>;
export type ActivateAccountBody = z.infer<typeof activateAccount>;
export type ForgotPasswordBody = z.infer<typeof forgotPassord>;
export type ResetPasswordBody = z.infer<typeof resetPassword>;
