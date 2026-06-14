import { Prisma } from '@/generated/prisma/client';
import moment, { type Moment } from 'moment';

export type User = Prisma.UserGetPayload<{}>;
export type Token = Prisma.TokenGetPayload<{}>;

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  type: string
}

export interface TokenTypeConfig {
  secret: string;
  accessExpirationMinutes: number;
  refreshExpirationDays: number;
  resetPasswordExpirationMinutes: number;
  verifyEmailExpirationMinutes: number;
}


export enum TokenTypes {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  RESET_PASSWORD  = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  UPDATE_EMAIL = 'UPDATE_EMAIL'
};

export type tokenTypes = 'ACCESS' | 'REFRESH'| 'RESET_PASSWORD' |  'VERIFY_EMAIL' | 'UPDATE_EMAIL';

export interface TypeSaveToken {
  token: string, 
  userId: string, 
  expires: Moment, 
  type: tokenTypes,
  newEmail?: string,
  blacklisted?: boolean
}
