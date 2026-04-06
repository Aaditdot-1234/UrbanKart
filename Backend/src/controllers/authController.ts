import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import AppDataSource from "../datasource";
import { Users } from "../entities/Users";
import { NotFound } from "../errors/appError";
import { COOKIE_NAME } from "../auth/passport";
import { sessionStore } from "../utils/sessionStore";
import { AuthService, UserData } from "../services/authService";

export class AuthController {
    static register = asyncHandler(async (req: Request<{}, any, UserData>, res: Response) => {
        const user = await AuthService.register(req.body);
        res.status(201).json({ message: 'User Registered successfully.', user });
    });

    static login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const meta = {
            userAgent: req.headers['user-agent'] || 'Unknown',
            ip: req.ip || 'Unknown'
        };

        const { token, userWithoutPassword } = await AuthService.login(email, password, meta);

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: "Login Successful.", userWithoutPassword });
    });

    static logout = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as Users & { jti: string };
        sessionStore.delete(user.jti);
        res.clearCookie(COOKIE_NAME);
        res.status(200).json({ message: "Logout successful." });
    });

    static lockUserAccount = asyncHandler(async (req: Request<{ userId: string }>, res: Response) => {
        const { userId } = req.params;
        await AuthService.lockAccount(userId);
        res.status(200).json({ message: `User has been locked successfully.` });
    });

    static getOTP = asyncHandler(async (req: Request, res: Response) => {
        const { email} = req.body;
        const otp = await AuthService.requestOTP(email);
        res.status(201).json({ message: "OTP generated successfully.", otp });
    });

    static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
        const { email, otp, password } = req.body;
        const user = await AuthService.resetPassword(email, otp, password);
        res.status(201).json({ message: "Password reset successful.", user });
    });

    static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const userRepo = AppDataSource.getRepository(Users);
        const users = await userRepo.find();
        res.status(200).json({ message: "Users fetched successfully.", users });
    });

    static getUserById = asyncHandler(async (req: Request<{ userId: string }>, res: Response) => {
        const { userId } = req.params;
        const userRepo = AppDataSource.getRepository(Users);
        const user = await userRepo.findOne({ where: { id: userId } })
        res.status(200).json({ message: "User fetched successfully.", user });
    })

    static updateUserInfo = asyncHandler(async (req: Request, res: Response) => {
        const { name, phone, email } = req.body;
        const loggedInUserInfo = (req as any).user;
        const userRepo = AppDataSource.getRepository(Users);

        const user = await userRepo.findOne({ where: { id: loggedInUserInfo.id } });
        if (!user) throw new NotFound("User Not found");

        user.name = name ?? user.name;
        user.email = email ?? user.email;
        user.phone = phone ?? user.phone;

        const savedUser = await userRepo.save(user);
        const { passwordHash, ...userWithoutPassword } = savedUser;
        res.status(200).json({ message: "User information updated successfully.", user: userWithoutPassword });
    });
}