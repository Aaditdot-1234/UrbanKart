import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { requireAdmin, requireAuth } from "../middleware/authMidlleware";

const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login)
authRouter.post('/logout', requireAuth, AuthController.logout);
authRouter.get('/users', requireAuth, requireAdmin, AuthController.getAllUsers);
authRouter.get('/users/:userId', requireAuth, AuthController.getUserById); 
authRouter.patch('/getOTP', AuthController.getOTP); 
authRouter.patch('/users/:userId/lock', requireAuth, requireAdmin, AuthController.lockUserAccount);
authRouter.patch('/forgot-password', AuthController.forgotPassword);
authRouter.patch('/users/update-info', requireAuth, AuthController.updateUserInfo);

export default authRouter;