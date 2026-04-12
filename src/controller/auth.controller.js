import { generateToken } from '../lib/generateToken.js';
import { sanitizeUser } from '../lib/sanitizeUser.js';
import { setAuthCookie } from '../lib/setCookie.js';
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
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return sendError(res, { status: 400, message: 'All fields are required' });
        }

        const isUserExists = await UserModel.findOne({
            $or: [{ username }, { email }],
        });

        if (isUserExists) {
            return sendError(res, { status: 400, message: 'User already exists' });
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

        const token = generateToken(user);
        setAuthCookie(res, token);

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

const authController = {
    registerUserController,
    loginUserController,
};
export default authController;
