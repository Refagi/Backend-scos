import { TokenServices, AdminService } from './index';
import { ApiError } from '@/utils/ApiError';
import httpStatusCode from 'http-status-codes';
import prisma from '@/../prisma/client';
import { TokenTypes } from '@/models/token.model';
import type { LoginType, RegisterBody } from '@/models/auth.model';
import bcrypt from 'bcryptjs'
import { Role } from '@/generated/prisma/enums';


export class AuthServices {
   static async register(body: RegisterBody) {
        const existing = await prisma.user.findUnique({
            where: { email: body.email }
        });

        if (existing) {
            throw new ApiError(httpStatusCode.CONFLICT, 'Email sudah digunakan');
        }

        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(body.password, salt)
        const userData: RegisterBody = {
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: body.role || Role.customer,
            status: 'active',
        };

        const user = await prisma.user.create({ data: userData });

        return user;
    }


    static async login(userBody: LoginType) {
        const { email, password } = userBody;
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if (!user) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Email atau Password salah!');
        }

        if (!user.password) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Password belum diatur, silahkan atur password terlebih dahulu!');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Email atau Password salah!');
        }

        await prisma.token.deleteMany({
            where: { userId: user.id, type: 'REFRESH' }
        })

        return user;
    }

    static async logout(refreshToken: string) {
        const getRefreshToken = await prisma.token.findFirst({
            where: { token: refreshToken, type: 'REFRESH', blacklisted: false }
        });

        await prisma.user.update({
            where: { id: getRefreshToken?.userId },
            data: { status: 'active' }
        })

        if (!getRefreshToken) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Kamu telah logout!');
        }
        await prisma.token.delete({ where: { id: getRefreshToken.id } });
    };

    static async refreshToken (tokens: string) {
        try {
            const refreshTokenDoc = await TokenServices.verifyToken(tokens, TokenTypes.REFRESH);

            if (!refreshTokenDoc) {
                throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Token tidak valid!');
            }

            await prisma.token.delete({where: { id: refreshTokenDoc.id }});

            const newToken = await TokenServices.generateAuthTokens(refreshTokenDoc.userId);
            return newToken;
        } catch (error) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Silahkan lakukan verifikasi!');
        }
    };

}

export default AuthServices;
