import { generateToken } from '../lib/generateToken.js';
import { sanitizeUser } from '../lib/sanitizeUser.js';
import { sendError } from '../lib/sendError.js';
import { sendResponse } from '../lib/sendResponse.js';
import { setAuthCookie } from '../lib/setCookie.js';
import BlacklistTokenModel from '../models/blacklist.model.js';
import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';

/**
 * @route POST /api/auth/register
 * @name registerUserController
 * @description Register user (expects username, email, password) and return JWT token
 * @access Public
 */
const registerUserController = async (req, res) => {
    try {
        const { username = '', email = '', password = '' } = req.body;

        if (!username) return sendError(res, { status: 400, message: 'Username is required' });
        if (!email) return sendError(res, { status: 400, message: 'Email is required' });
        if (!password) return sendError(res, { status: 400, message: 'Password is required' });

        const isUserExists = await UserModel.findOne({
            $or: [{ username }, { email }],
        });

        if (isUserExists) {
            if (isUserExists.username === username) {
                return sendError(res, { status: 400, message: 'Username already taken' });
            }

            if (isUserExists.email === email) {
                return sendError(res, { status: 400, message: 'Email already registered' });
            }
        }

        const hashedPswd = await bcrypt.hash(password, 10);

        const user = await UserModel.create({ username, email, password: hashedPswd });

        const token = generateToken(user);
        setAuthCookie(res, token);

        sendResponse(res, {
            status: 201,
            message: 'User registered successfully',
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error('Error in registerUserController:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route POST /api/auth/login
 * @name loginUserController
 * @description Login user (expects username, password) and return JWT token
 * @access Public
 */
const loginUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return sendError(res, {
                status: 400,
                message: 'Username/email and password are required',
            });
        }

        const query = username ? { username } : { email };

        const user = await UserModel.findOne(query);

        if (!user) {
            return sendError(res, { status: 401, message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return sendError(res, { status: 401, message: 'Invalid password' });
        }

        const accessToken = generateToken(user);
        setAuthCookie(res, accessToken);

        sendResponse(res, {
            status: 200,
            message: 'User logged in successfully',
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error('Error in loginUserController:', error);
        sendError(res, { status: 500, message: 'Server error' });
    }
};

/**
 * @route POST /api/auth/logout
 * @name logoutUserController
 * @description Logout user
 * @access Public
 */
const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (token) {
            await BlacklistTokenModel.create({ token });
        }
        res.clearCookie('token');
        sendResponse(res, {
            status: 200,
            message: 'User logged out successfully',
        });
    } catch (error) {
        console.error('Error in logoutUserController:', error);
        sendError(res, { status: 500, message: 'Server error' });
    }
};

/**
 * @route GET /api/auth/me
 * @name getMeController
 * @description Get current user
 * @access Private
 */
const getMeController = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        sendResponse(res, {
            status: 200,
            message: 'User fetched successfully',
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error('Error in getMeController:', error);
        sendError(res, { status: 500, message: 'Server error' });
    }
};

const authController = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
};
export default authController;
