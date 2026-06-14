import { jwtVerify } from 'jose'
import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError';
import type { MiddlewareHandler } from "hono";
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { config } from '@/config/config';
import prisma from '../../prisma/client';
import { getCookie } from 'hono/cookie'


export const auth = (requiredRole?: string[]): MiddlewareHandler => {
  return async (c, next) => {
    try {
      const authHeader = c.req.header('Authorization')
      const cookiesToken = getCookie(c, 'accessToken')

      let token: string | null = null

      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7)
      } else if (cookiesToken) {
        token = cookiesToken
      }

      if (!token) {
        throw new HTTPException(
          httpStatusCode.UNAUTHORIZED as ContentfulStatusCode,
          { message: 'Silahkan lakukan verifikasi!' }
        )
      }

      const secret = new TextEncoder().encode(config.jwt.secret)
      const { payload } = await jwtVerify(token, secret)

      if (payload.type !== 'ACCESS') {
        throw new HTTPException(
          httpStatusCode.UNAUTHORIZED as ContentfulStatusCode,
          { message: 'Silahkan lakukan verifikasi!' }
        )
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.sub as string }
      })

      if (!user) {
        throw new HTTPException(
          httpStatusCode.UNAUTHORIZED as ContentfulStatusCode,
          { message: 'Silahkan lakukan verifikasi!' }
        )
      }

      if (requiredRole && !requiredRole.includes(user.role)) {
        throw new HTTPException(
          httpStatusCode.FORBIDDEN as ContentfulStatusCode,
          { message: 'Forbidden!' }
        )
      }

      c.set('user', user)
      await next()
    } catch (err) {
      throw new HTTPException(
        httpStatusCode.UNAUTHORIZED as ContentfulStatusCode,
        { message: 'Invalid or expired token' }
      )
    }
  }
}