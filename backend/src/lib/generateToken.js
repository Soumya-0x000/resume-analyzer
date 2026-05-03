import jwt from 'jsonwebtoken';

export const generateToken = (user, expiresIn = '5d') => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn,
    });
};
