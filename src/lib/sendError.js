export const sendError = (res, { status = 500, message }) => {
    return res.status(status).json({
        success: false,
        message,
    });
};
