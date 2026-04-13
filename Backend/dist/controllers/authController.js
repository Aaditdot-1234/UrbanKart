"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const asyncHandler_1 = require("../errors/asyncHandler");
const datasource_1 = __importDefault(require("../datasource"));
const Users_1 = require("../entities/Users");
const appError_1 = require("../errors/appError");
const passport_1 = require("../auth/passport");
const sessionStore_1 = require("../utils/sessionStore");
const authService_1 = require("../services/authService");
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await authService_1.AuthService.register(req.body);
    res.status(201).json({ message: 'User Registered successfully.', user });
});
AuthController.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const meta = {
        userAgent: req.headers['user-agent'] || 'Unknown',
        ip: req.ip || 'Unknown'
    };
    const { token, userWithoutPassword } = await authService_1.AuthService.login(email, password, meta);
    res.cookie(passport_1.COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login Successful.", user: userWithoutPassword });
});
AuthController.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    sessionStore_1.sessionStore.delete(user.jti);
    res.clearCookie(passport_1.COOKIE_NAME);
    res.status(200).json({ message: "Logout successful." });
});
AuthController.lockUserAccount = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    await authService_1.AuthService.lockAccount(userId);
    res.status(200).json({ message: `User has been locked successfully.` });
});
AuthController.getOTP = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const otp = await authService_1.AuthService.requestOTP(email);
    res.status(201).json({ message: "OTP generated successfully.", otp });
});
AuthController.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, otp, password } = req.body;
    const user = await authService_1.AuthService.resetPassword(email, otp, password);
    res.status(201).json({ message: "Password reset successful.", user });
});
AuthController.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userRepo = datasource_1.default.getRepository(Users_1.Users);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [users, total] = await userRepo.findAndCount({
        skip: skip,
        take: limit,
        order: { createdAt: 'DESC' }
    });
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        message: "Users fetched successfully.", users, meta: {
            totalItems: total,
            itemCount: users.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }
    });
});
AuthController.getUserById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const userRepo = datasource_1.default.getRepository(Users_1.Users);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user)
        throw new appError_1.NotFound("User Not found");
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(200).json({ message: "User fetched successfully.", user: userWithoutPassword });
});
AuthController.updateUserInfo = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, phone, email } = req.body;
    const modifiedEmail = email?.toLowerCase().trim();
    const loggedInUserInfo = req.user;
    const userRepo = datasource_1.default.getRepository(Users_1.Users);
    const user = await userRepo.findOne({ where: { id: loggedInUserInfo.id } });
    if (!user)
        throw new appError_1.NotFound("User Not found");
    user.name = name ?? user.name;
    user.email = modifiedEmail ?? user.email;
    user.phone = phone ?? user.phone;
    const savedUser = await userRepo.save(user);
    const { passwordHash, ...userWithoutPassword } = savedUser;
    res.status(200).json({ message: "User information updated successfully.", user: userWithoutPassword });
});
AuthController.getLoggedInUserinfo = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new appError_1.NotFound("User not authenticated");
    }
    const userRepo = datasource_1.default.getRepository(Users_1.Users);
    const foundUser = await userRepo.findOne({ where: { id: user.id } });
    if (!foundUser)
        throw new appError_1.NotFound("User Not found");
    const { passwordHash, ...userWithoutPassword } = foundUser;
    res.status(200).json({ message: "User information fetched successfully.", user: userWithoutPassword });
});
