import { isDev } from './isDev.js';

export const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: !isDev,
        sameSite: isDev ? 'lax' : 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    });
};
