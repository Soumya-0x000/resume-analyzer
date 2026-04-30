import { sendError } from '../lib/sendError.js';
import jwt from 'jsonwebtoken';
import BlacklistTokenModel from '../models/blacklist.model.js';

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return sendError(res, { status: 401, message: 'Token not provided' });

    const isTokenBlackListed = await BlacklistTokenModel.findOne({ token });

    if (isTokenBlackListed) return sendError(res, { status: 401, message: 'Token is invalid' });

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error in authenticateUser:', error);
        return sendError(res, { status: 401, message: 'Unauthorized: Invalid or expired token' });
    }
};

export default authenticateUser;
