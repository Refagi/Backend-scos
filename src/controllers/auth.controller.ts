import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { TokenServices, AuthServices } from '@/services/index.js';
import { type  Context } from 'hono';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import type { RegisterBody } from '@/models/auth.model.js';
import type { LoginBody, LogoutBody } from '@/validations/auth.validation.js';

class AuthController {

  static register = catchAsync(async (c: Context) => {
        const body = c.get('parsedJson') as RegisterBody;

        const user = await AuthServices.register(body);

        let tokens = await TokenServices.generateAuthTokens(user.id);

            setCookie(c, 'accessToken', tokens.access.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
                path: '/v1',
                maxAge: 60 * 60,
            });
            setCookie(c, 'refreshToken', tokens.refresh.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
                path: '/v1',
                maxAge: 60 * 60 * 24 * 30,
            });

        const { password: _, ...userWithoutPassword } = user;

        return c.json({
            status: httpStatusCode.CREATED,
            message: 'Registrasi berhasil',
            data: { user: userWithoutPassword }
        });
    });

    static login = catchAsync(async (c: Context) => {
        const {email, password} = c.get('parsedJson') as LoginBody;
        if(!password ) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Password belum diatur, silahkan atur password terlebih dahulu!');
        }
        const userBody = { email, password }
        const user = await AuthServices.login(userBody);
        const tokens = await TokenServices.generateAuthTokens(user.id);
        setCookie(c, 'accessToken', tokens.access.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            path: '/v1',
            maxAge: 60 * 60 // 60 minutes
        });
        setCookie(c, 'refreshToken', tokens.refresh.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            path: '/v1',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });
        const { password: _, ...userWithoutPassword } = user;

        return c.json({status: httpStatusCode.OK, message: 'Login is successfully', data: { user: userWithoutPassword, tokens }})
    });


    static logout = catchAsync(async (c: Context) => {
        const getCookies = getCookie(c, 'refreshToken') as LogoutBody['refreshToken'];
        if (!getCookies) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Kamu telah logout!');
        }
        await AuthServices.logout(getCookies);
        deleteCookie(c, 'accessToken', { path: '/v1' });
        deleteCookie(c, 'refreshToken', { path: '/v1' });
        return c.json({status: httpStatusCode.OK, message: 'Logout is successfully'});
    });

    static refreshToken = catchAsync(async (c: Context) => {
        const getToken = getCookie(c, 'refreshToken') as LogoutBody['refreshToken'];
        if (!getToken) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Refresh token tidak ditemukan!');
        }
        const newToken = await AuthServices.refreshToken(getToken);
        setCookie(c, 'accessToken', newToken.access.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            path: '/v1',
            maxAge: 60 * 60 // 60 minutes
        });
        setCookie(c, 'refreshToken', newToken.refresh.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            path: '/v1',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });
        return c.json({status: httpStatusCode.OK, message: 'Token berhasil diperbarui', data: newToken});
    })

    static getCurrentUser = catchAsync(async (c: Context) => {
        const user = c.get('user')

        return c.json({
          data: {
            id:    user.id,
            name:  user.name,
            email: user.email,
            role:  user.role,
          },
          status: httpStatusCode.OK,
        })
    })
}

export default AuthController;
