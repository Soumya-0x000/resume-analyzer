import { Router } from 'express';
import authController from '../controller/auth.controller.js';
import authenticateUser from '../middlewares/auth.middleware.js';

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register user and return JWT token
 * @access Public
 */
authRouter.post('/register', authController.registerUserController);

/**
 * @route POST /api/auth/check-username-or-email
 * @description Check username or email availability
 * @access Public
 */
authRouter.post('/check-username-or-email', authController.checkUsernameOrEmailAvailability);

/**
 * @route POST /api/auth/login
 * @description Login user and return JWT token
 * @access Public
 */
authRouter.post('/login', authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description Logout user
 * @access Public
 */
authRouter.get('/logout', authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description Get current user
 * @access Private
 */
authRouter.get('/get-me', authenticateUser, authController.getMeController);

/**
 * @route PATCH /api/auth/update-me
 * @description Update current user
 * @access Private
 */
authRouter.patch('/update-me', authenticateUser, authController.updateMeController);

/**
 * @route POST /api/auth/recover-password
 * @description Recover password
 * @access Public
 */
authRouter.post('/recover-password', authController.recoverPassword);

export default authRouter;
