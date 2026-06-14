import { SignJWT, jwtVerify } from 'jose'
import moment, { type Moment } from 'moment';
import { config } from '@/config/config';
import { type tokenTypes, type TypeSaveToken } from '@/models/token.model';
import prisma from '@/../prisma/client.js';
import { ApiError } from '@/utils/ApiError';
import type { User, Token, JwtPayload } from '@/models/token.model';
import httpStatusCode from 'http-status-codes';
import { AdminService } from './index';


class TokenService {
  static async generateToken ( userId: string, expires: Moment, type: tokenTypes, secret: string = config.jwt.secret): Promise<string> {
    const payload = { type };
    const encodedSecret = new TextEncoder().encode(secret);

    return new SignJWT( payload )
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(expires.toDate())
      .sign(encodedSecret);
  }

  static async saveToken (tokenBody: TypeSaveToken): Promise<Token> {
    const { token, userId, expires, type,  newEmail, blacklisted } = tokenBody
      const tokenDoc: Token = await prisma.token.create({
        data: {
            token,
            userId,
            expires: expires instanceof Date ? expires : expires.toDate(),
            type,
            newEmail,
            blacklisted
        }})
        return tokenDoc;
  }

  static async verifyToken (token: string, type: tokenTypes) {
    try {
      const encodedSecret = new TextEncoder().encode(config.jwt.secret);
      const payload = (await jwtVerify(token, encodedSecret)).payload;
      const tokenDoc = await prisma.token.findFirst({
        where: {
          token,
          type,
          userId: payload.sub,
          blacklisted: false
        }
      });
      if (!tokenDoc) {
        throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Token not found!');
      }
      return tokenDoc;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Token is invalid!';
      throw new ApiError(httpStatusCode.UNAUTHORIZED, message);
    }
  }

  static async generateAuthTokens(userId: string) {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = await this.generateToken(userId, accessTokenExpires, 'ACCESS');

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = await this.generateToken(userId, refreshTokenExpires, 'REFRESH');

    await this.saveToken({token: refreshToken, userId, expires: refreshTokenExpires, type: 'REFRESH'});
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate()
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate()
      }
    }
  }

  static async generateVeryfyEmailToken(users: User) {
    const userId = users.id;
    if (!userId) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
    }
    await prisma.token.deleteMany({
      where: {
        userId,
        type: 'VERIFY_EMAIL'
      }
    });

    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = await this.generateToken(userId, expires, 'VERIFY_EMAIL');
    await this.saveToken({token: verifyEmailToken, userId, expires, type: 'VERIFY_EMAIL'});
    return verifyEmailToken;
  }


  // static async generateResetPasswordToken(email: string) {
  //   const user = await AdminUserServices.getUserByEmail(email);
  //   if (!user) {
  //     throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
  //   }
  //     await prisma.token.deleteMany({
  //       where: {
  //         userId: user.id,
  //         type: 'RESET_PASSWORD'
  //       }
  //     });

  //     const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  //     const resetPasswordToken = await this.generateToken(user.id, expires, 'RESET_PASSWORD');
  //     await this.saveToken({token: resetPasswordToken, userId: user.id, expires, type: 'RESET_PASSWORD'});
  //     return resetPasswordToken;
  // }

  //   static async generateUpdateEmailToken(userId: string, newEmail: string) {
  //   const user = await AdminUserServices.getUserById(userId);
  //   if (!user) {
  //     throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
  //   }
  //     await prisma.token.deleteMany({
  //       where: {
  //         userId,
  //         type: 'UPDATE_EMAIL'
  //       }
  //     });

  //     const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  //     const updateEmail= await this.generateToken(user.id, expires, 'UPDATE_EMAIL');
  //     await this.saveToken({token: updateEmail, userId: user.id, expires, type: 'UPDATE_EMAIL', newEmail});
  //     return updateEmail;
  // }

}

export default TokenService;
