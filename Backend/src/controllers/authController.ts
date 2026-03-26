import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import AppDataSource from "../datasource";
import { UserRole, Users } from "../entities/Users";
import { ConflictError, NotFound, UnauthorisedError, ValidationError } from "../errors/appError";
import { hashPassword, VerifyPassword } from "../auth/password";
import { signToken } from "../auth/jwt";
import { SessionStore } from "../utils/sessionStore";

export class AuthController {
    static register = asyncHandler(async (req: Request, res: Response) => {
        const { name, email, password, phone, address } = req.body;
        const userRepo = AppDataSource.getRepository(Users);

        if (!name || !email || !password || !phone || !address) {
            throw new ValidationError('Missing important fields: Name, Email, Password, Phone are required!');
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await userRepo.findOne({
            where: { email: normalizedEmail }
        })

        if (existingUser) {
            throw new ConflictError("A User with similar email exists!");
        }

        const hashedPassword = await hashPassword(password);

        const savedUser = userRepo.create({
            name: name,
            email: normalizedEmail,
            role: UserRole.Customer,
            isActive: true,
            passwordHash: hashedPassword,
            phone: phone,
            address: address,
        })

        await userRepo.save(savedUser);

        res.status(201).json({ message: 'User Registered successfully.' });
    })

    static login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userRepo = AppDataSource.getRepository(Users);

        if (!email || !password) {
            throw new ValidationError("Missing important fields: Email, Password are required!");
        }

        const user = await userRepo.createQueryBuilder('users')
            .addSelect('users.passwordhash')
            .where('users.email = :email', { email: email.toLowerCase().trim() })
            .getOne();

        if (!user) {
            throw new NotFound("User not found.")
        }

        const isPasswordValid = await VerifyPassword(user.passwordHash, password);

        if (!isPasswordValid) {
            throw new ValidationError("Credentials are invalid!");
        }

        const token = signToken({ sub: user.id, email: user.email, role: user.role });

        SessionStore.set(user.id, {
            lastActivity: Date.now(),
            role: user.role
        })

        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1 * 60 * 60 * 1000,
        })

        res.status(200).json({ message: "Login Sucessful." });
    })

    static logout = asyncHandler(async (req: Request, res: Response) => {
        const user = (req as any).user;

        const userId = user.id;

        SessionStore.delete(userId);
        res.clearCookie('access_token');
        res.status(200).json({ message: "Logout successful." });
    })

    static lockUserAccount = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as {id: string};
        const userRepo = AppDataSource.getRepository(Users);

        const user = await userRepo.findOne({
            where: { id: id }
        });

        if (!user) {
            throw new NotFound("User not found");
        }

        user.isLocked = true; 

        await userRepo.save(user);

        res.status(200).json({
            message: `User ${user.email} has been locked successfully.`
        });
    });

    static forgotPassword = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const customisedEmail = email.toLowerCase().trim();

        const userRepo = AppDataSource.getRepository(Users);

        const user = await userRepo.findOne({
            where: {email: customisedEmail}
        })

        if(!user){
            throw new UnauthorisedError('Authorization required.');
        }

        const newHashedPassword = await hashPassword(password);

        user.passwordHash = newHashedPassword;

        await userRepo.save(user);

        res.status(201).json({message: "Password reset successfull."});
    })
}