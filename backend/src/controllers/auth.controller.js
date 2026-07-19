import mongoose from "mongoose";
import { generateToken } from "../lib/generateToken.js";
import { sanitizeUser } from "../lib/sanitizeUser.js";
import { sendError } from "../lib/sendError.js";
import { sendResponse } from "../lib/sendResponse.js";
import { setAuthCookie } from "../lib/setCookie.js";
import BlacklistTokenModel from "../models/blacklist.model.js";
import SessionModel from "../models/session.model.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cryptoHash } from "../lib/cacheKey.js";

/**
 * @route POST /api/auth/register
 * @name registerUserController
 * @description Register user (expects username, email, password) and return JWT token
 * @access Public
 */
const registerUserController = async (req, res) => {
    const mongoSession = await mongoose.startSession();
    try {
        mongoSession.startTransaction();
        const { username = "", email = "", password = "" } = req.body;

        if (!username) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 400, message: "Username is required" });
        }
        if (!email) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 400, message: "Email is required" });
        }
        if (!password) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 400, message: "Password is required" });
        }

        const isUserExists = await UserModel.findOne({
            $or: [{ username }, { email }],
        }).session(mongoSession);

        if (isUserExists) {
            await mongoSession.abortTransaction();
            if (isUserExists.username === username) {
                return sendError(res, { status: 400, message: "Username already taken" });
            }

            if (isUserExists.email === email) {
                return sendError(res, { status: 400, message: "Email already registered" });
            }
        }

        const hashedPswd = await bcrypt.hash(password, 10);

        const [user] = await UserModel.create([{ username, email, password: hashedPswd }], {
            session: mongoSession,
        });

        const refreshToken = generateToken({ user, expiresIn: "7d" });
        const refreshTokenHash = cryptoHash(refreshToken);
        const [session] = await SessionModel.create(
            [
                {
                    userId: user._id,
                    refreshTokenHash,
                    ip: req.ip,
                    userAgent: req.headers["user-agent"],
                },
            ],
            { session: mongoSession },
        );
        await mongoSession.commitTransaction();

        setAuthCookie({ res, token: refreshToken });

        const accessToken = generateToken({ user, expiresIn: "15m", sessionId: session._id });

        sendResponse(res, {
            status: 201,
            message: "User registered successfully",
            data: { ...sanitizeUser(user), accessToken },
        });
    } catch (error) {
        await mongoSession.abortTransaction();
        console.error("Error in registerUserController:", error);
        sendError(res, { status: 500, message: "Server error" });
    } finally {
        await mongoSession.endSession();
    }
};

/**
 * @route POST /api/auth/check-username-or-email
 * @name checkUsernameOrEmailAvailability
 * @description Check username or email availability
 * @access Public
 */
const checkUsernameOrEmailAvailability = async (req, res) => {
    try {
        const { username, email } = req.body;

        // 1. Email Regex Check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (username && username.length < 3) {
            return sendError(res, {
                status: 400,
                message: "Username must be at least 3 characters long",
            });
        }

        if (email && !emailRegex.test(email)) {
            return sendError(res, { status: 400, message: "Invalid email format" });
        }

        // 2. Optimized Query (Select only necessary fields)
        const isUserExists = await UserModel.findOne({
            $or: [...(username ? [{ username }] : []), ...(email ? [{ email }] : [])],
        })
            .collation({ locale: "en", strength: 2 })
            .select("username email")
            .lean();

        if (isUserExists) {
            // Normalize both to lowercase for the comparison
            const dbUsername = isUserExists.username?.toLowerCase();
            const inputUsername = username?.toLowerCase();

            const dbEmail = isUserExists.email?.toLowerCase();
            const inputEmail = email?.toLowerCase();

            if (username && dbUsername === inputUsername) {
                return sendError(res, { status: 400, message: "Username already taken" });
            }

            if (email && dbEmail === inputEmail) {
                return sendError(res, { status: 400, message: "Email already registered" });
            }
        }

        sendResponse(res, {
            status: 200,
            message: "Available",
        });
    } catch (error) {
        console.error("Error in checkUsernameOrEmailAvailability:", error);
        sendError(res, { status: 500, message: "Server error" });
    }
};

/**
 * @route POST /api/auth/login
 * @name loginUserController
 * @description Login user (expects username, password) and return JWT token
 * @access Public
 */
const loginUserController = async (req, res) => {
    const mongoSession = await mongoose.startSession();

    try {
        mongoSession.startTransaction();
        const { identifier, password } = req.body;

        if (!identifier || !identifier.trim()) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 400, message: "Username or email is required" });
        }

        if (!password) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 400, message: "Password is required" });
        }

        const trimmedIdentifier = identifier.trim();
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier);
        const query = isEmail
            ? { email: trimmedIdentifier.toLowerCase() }
            : { username: trimmedIdentifier };

        const user = await UserModel.findOne(query);

        if (!user) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 401, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 401, message: "Invalid password" });
        }

        const refreshToken = generateToken({ user, expiresIn: "7d" });
        const refreshTokenHash = cryptoHash(refreshToken);
        const [session] = await SessionModel.create(
            [
                {
                    userId: user._id,
                    refreshTokenHash,
                    ip: req.ip,
                    userAgent: req.headers["user-agent"],
                },
            ],
            { session: mongoSession },
        );
        if (!session) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 500, message: "Failed to create session" });
        }

        const accessToken = generateToken({ user, expiresIn: "15m", sessionId: session._id });
        await mongoSession.commitTransaction();
        setAuthCookie({ res, token: refreshToken });

        const response = { ...sanitizeUser(user), accessToken };
        sendResponse(res, {
            status: 200,
            message: "User logged in successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error in loginUserController:", error);
        sendError(res, { status: 500, message: "Server error" });
    }
};

/**
 * @route POST /api/auth/logout
 * @name logoutUserController
 * @description Logout user
 * @access Public
 */
const logoutUserController = async (req, res) => {
    const mongoSession = await mongoose.startSession();
    try {
        mongoSession.startTransaction();
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            await mongoSession.abortTransaction();
            return sendError(res, {
                status: 400,
                message: "Refresh token not found",
            });
        }
        const refreshTokenHash = cryptoHash(refreshToken);

        const session = await SessionModel.findOne({ refreshTokenHash, revoked: false }, null, {
            session: mongoSession,
        });
        if (!session) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 400, message: "Invalid refresh token" });
        }
        session.revoked = true;
        await session.save();

        if (refreshToken) {
            await BlacklistTokenModel.create([{ token: refreshToken }], { session: mongoSession });
        }
        await mongoSession.commitTransaction();

        res.clearCookie("refreshToken");
        return sendResponse(res, {
            status: 200,
            message: "User logged out successfully",
        });
    } catch (error) {
        await mongoSession.abortTransaction();
        console.error("Error in logoutUserController:", error);
        return sendError(res, { status: 500, message: "Server error" });
    } finally {
        await mongoSession.endSession();
    }
};

/**
 * @route GET /api/auth/logout-all
 * @name logoutAllController
 * @description Logout user from all sessions
 * @access Public
 */
const logoutAllController = async (req, res) => {
    const mongoSession = await mongoose.startSession();
    try {
        mongoSession.startTransaction();
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            await mongoSession.abortTransaction();
            return sendError(res, {
                status: 400,
                message: "Refresh token not found",
            });
        }

        const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const userId = decodedRefreshToken?.id;
        if (!userId) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 400, message: "User ID not found" });
        }

        await SessionModel.updateMany(
            { userId, revoked: false },
            { revoked: true },
            { session: mongoSession },
        );
        res.clearCookie("refreshToken");
        await mongoSession.commitTransaction();
        return sendResponse(res, {
            status: 200,
            message: "User logged out from all sessions successfully",
        });
    } catch (error) {
        await mongoSession.abortTransaction();
        console.error("Error in logoutAllController:", error);
        return sendError(res, { status: 500, message: "Server error" });
    } finally {
        await mongoSession.endSession();
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
        if (!req.user || !req.user.id) {
            return sendError(res, { status: 401, message: "Unauthorized" });
        }

        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return sendError(res, { status: 404, message: "User not found" });
        }

        sendResponse(res, {
            status: 200,
            message: "User fetched successfully",
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Error in getMeController:", error);
        sendError(res, { status: 500, message: "Server error" });
    }
};

/**
 * @route PATCH /api/auth/update-me
 * @name updateMeController
 * @description Update current user's profile (username, email, avatar) and/or password
 * @access Private
 */
const updateMeController = async (req, res) => {
    try {
        const { username, email, avatar, currentPassword, newPassword } = req.body;
        console.log(username)
        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return sendError(res, { status: 404, message: "User not found" });
        }

        if (username && username !== user.username) {
            const existing = await UserModel.findOne({ username }).collation({
                locale: "en",
                strength: 2,
            });
            if (existing && String(existing._id) !== String(user._id)) {
                return sendError(res, { status: 400, message: "Username already taken" });
            }
            user.username = username;
        }

        if (email && email.toLowerCase() !== user.email) {
            const existing = await UserModel.findOne({ email: email.toLowerCase() });
            if (existing && String(existing._id) !== String(user._id)) {
                return sendError(res, { status: 400, message: "Email already registered" });
            }
            user.email = email;
        }

        if (typeof avatar === "string") {
            const approxBytes = (avatar.length * 3) / 4;
            if (approxBytes > 2 * 1024 * 1024) {
                return sendError(res, { status: 400, message: "Avatar image is too large (max 2MB)" });
            }
            user.avatar = avatar;
        }

        if (newPassword) {
            if (!currentPassword) {
                return sendError(res, { status: 400, message: "Current password is required" });
            }
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return sendError(res, { status: 400, message: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return sendError(res, {
                    status: 400,
                    message: "New password must be at least 6 characters",
                });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();
        sendResponse(res, {
            status: 200,
            message: "Profile updated successfully",
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Error in updateMeController:", error);
        sendError(res, { status: 500, message: "Server error" });
    }
};

/**
 * @route POST /api/auth/recover-password
 * @name recoverPassword
 * @access Public
 */
const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email)
        const user = await UserModel.findOne({ email });
        if (!user) {
            return sendError(res, { status: 401, message: "Invalid email" });
        }
        const token = generateToken({ user });
        res.redirect(`${process.env.CLIENT_URL}/reset-password?token=${token}`);
        // sendResponse(res, {
        //     status: 200,
        //     message: 'Password reset link sent to your email',
        // });
    } catch (error) {
        console.error("Error in recoverPassword:", error);
        sendError(res, { status: 500, message: "Server error" });
    }
};

/**
 * @route POST /api/auth/refresh-token
 * @name refreshTokenController
 * @access Public
 */
const refreshTokenController = async (req, res) => {
    const mongoSession = await mongoose.startSession();

    try {
        mongoSession.startTransaction();

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 401, message: "No refresh token provided" });
        }

        let decodedToken;

        try {
            decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 401, message: "Invalid or expired refresh token" });
        }

        const refreshTokenHash = cryptoHash(refreshToken);
        const session = await SessionModel.findOne(
            { userId: decodedToken.id, refreshTokenHash, revoked: false },
            null,
            { session: mongoSession },
        );

        if (!session) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 401, message: "Invalid session" });
        }

        const user = await UserModel.findById(decodedToken.id, null, { session: mongoSession });

        if (!user) {
            await mongoSession.abortTransaction();
            return sendError(res, { status: 401, message: "User not found" });
        }

        const accessToken = generateToken({ user, expiresIn: "15m", sessionId: session._id });

        const newRefreshToken = generateToken({ user, expiresIn: "7d" });
        const newHashedRefreshToken = cryptoHash(newRefreshToken);

        session.refreshTokenHash = newHashedRefreshToken;
        await session.save({ session: mongoSession });

        await mongoSession.commitTransaction();

        setAuthCookie({ res, token: newRefreshToken });
        return sendResponse(res, {
            status: 200,
            message: "Token refreshed successfully",
            data: { ...sanitizeUser(user), accessToken },
        });
    } catch (error) {
        if (mongoSession.inTransaction()) {
            await mongoSession.abortTransaction();
        }
        console.error("Error in refreshTokenController:", error);
        sendError(res, { status: 500, message: "Server error" });
    } finally {
        await mongoSession.endSession();
    }
};

const authController = {
    registerUserController,
    checkUsernameOrEmailAvailability,
    loginUserController,
    logoutUserController,
    logoutAllController,
    getMeController,
    updateMeController,
    recoverPassword,
    refreshTokenController,
};
export default authController;
