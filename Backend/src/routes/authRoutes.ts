import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { requireAdmin, requireJwt } from "../middleware/authMidlleware";

const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login)
authRouter.post('/logout', requireJwt, AuthController.logout);
authRouter.patch('/users/:id/lock', requireJwt, requireAdmin, AuthController.lockUserAccount);

export default authRouter;