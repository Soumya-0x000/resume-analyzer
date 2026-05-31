import { isDev } from './isDev.js';

/**
 * Set auth cookie for user
 * @name setAuthCookie
 * @description Set auth cookie for user
 * @access Private
 * @param {Object} res - Response object
 * @param {string} token - Token to set cookie for
 * @param {string} expiresIn - Expiry time for cookie (optional, default: 7 days)
 * @param {string} tokenName - Name of the cookie (optional, default: 'refreshToken')
 */
export const setAuthCookie = ({
    res,
    token,
    expiresIn = 7 * 24 * 60 * 60 * 1000,
    tokenName = 'refreshToken',
}) => {
    const secure = process.env.NODE_ENV === 'production';

    if (!res) {
        throw new Error('setAuthCookie: res is required');
    }

    res.cookie(tokenName, token, {
        httpOnly: true,
        secure,
        sameSite: secure ? 'strict' : 'lax',
        maxAge: expiresIn,
    });
};
