import UserModel from "../models/user.model";

/**
 * @route POST /api/auth/register
 * @name registerUserController
 * @description Register user (expects username, email, password) and return JWT token
 * @access Public
 */
const registerUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
    } catch (error) {
        console.error("Error in registerUserController:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const authController = {
    registerUserController,
};
export default authController;
