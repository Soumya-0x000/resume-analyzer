import { Router } from "express";
import authController from "../controller/auth.controller";

const authRouter = Router();

/** 
 * @route POST /api/auth/register
 * @description Register user and return JWT token
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);

export default authRouter;
