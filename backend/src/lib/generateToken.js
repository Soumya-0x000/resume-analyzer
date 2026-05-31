import jwt from 'jsonwebtoken';

export const generateToken = ({ user, sessionId, expiresIn = '5d' }) => {
    return jwt.sign({ id: user._id, username: user.username, sessionId }, process.env.JWT_SECRET, {
        expiresIn,
    });
};
