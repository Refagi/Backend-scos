import { Role, UserStatus, OrderStatus, MenuCategory } from '@/generated/prisma/client.js'

 export enum ValidationType {
  BODY = 'body',
  QUERY = 'query',
  PARAM = 'param',
  HEADER = 'header',
  JSON = 'json',
}

export interface LoginType {
  email: string;
  password: string;
}

export type RegisterBody = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'customer';
    status?: UserStatus;

    // Seller only
    storeName?: string;
    description?: string;
    location?: string;
    image?: string;
};

export interface ActivateUserType extends LoginType {}

export interface ResetPasswordType {
  token: string;
  newPassword: string;
}
