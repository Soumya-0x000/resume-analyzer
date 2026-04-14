export const sanitizeUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
});
