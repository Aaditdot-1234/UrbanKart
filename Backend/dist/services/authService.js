"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const datasource_1 = __importDefault(require("../datasource"));
const Users_1 = require("../entities/Users");
const appError_1 = require("../errors/appError");
const password_1 = require("../auth/password");
const jwt_1 = require("../auth/jwt");
const sessionStore_1 = require("../utils/sessionStore");
const uuid_1 = require("uuid");
const Address_1 = require("../entities/Address");
const otpStore_1 = require("../utils/otpStore");
class AuthService {
    static async register(data) {
        const { name, email, password, phone, address } = data;
        const querryRunner = datasource_1.default.createQueryRunner();
        await querryRunner.connect();
        await querryRunner.startTransaction();
        try {
            if (!name || !email || !password || !phone || !address) {
                throw new appError_1.ValidationError('Missing fields: Name, Email, Password, Phone, and Address are required.');
            }
            const normalizedEmail = email.toLowerCase().trim();
            const existingUser = await querryRunner.manager.findOne(Users_1.Users, { where: { email: normalizedEmail } });
            if (existingUser)
                throw new appError_1.ConflictError("User with this email already exists.");
            const hashedPassword = await (0, password_1.hashPassword)(password);
            const user = querryRunner.manager.create(Users_1.Users, {
                name,
                email: normalizedEmail,
                role: Users_1.UserRole.Customer,
                isActive: true,
                passwordHash: hashedPassword,
                phone,
            });
            const savedUser = await querryRunner.manager.save(user);
            const addressInfo = querryRunner.manager.create(Address_1.Address, {
                address: address,
                address_title: "Home",
                is_default: true,
                user: savedUser,
            });
            await querryRunner.manager.save(addressInfo);
            await querryRunner.commitTransaction();
            const { passwordHash, ...savedUserWithoutPassword } = savedUser;
            return savedUserWithoutPassword;
        }
        catch (error) {
            console.error(error);
            await querryRunner.rollbackTransaction();
        }
        finally {
            await querryRunner.release();
        }
    }
    static async login(email, pass, meta) {
        if (!email || !pass)
            throw new appError_1.ValidationError("Email and Password are required.");
        const user = await this.userRepo.createQueryBuilder('users')
            .addSelect('users.passwordHash')
            .where('users.email = :email', { email: email.toLowerCase().trim() })
            .getOne();
        if (!user)
            throw new appError_1.NotFound("User not found.");
        const isValid = await (0, password_1.VerifyPassword)(user.passwordHash, pass);
        if (!isValid)
            throw new appError_1.ValidationError("Invalid credentials.");
        if (user.isLocked)
            throw new appError_1.UnauthorisedError("Account is locked by admin.");
        const jti = (0, uuid_1.v4)();
        const token = (0, jwt_1.signToken)({ sub: user.id, email: user.email, role: user.role, jti });
        sessionStore_1.sessionStore.create(jti, {
            userId: user.id,
            userName: user.name,
            createdAt: new Date(),
            userAgent: meta.userAgent,
            ip: meta.ip
        });
        const { passwordHash, ...userWithoutPassword } = user;
        return { token, userWithoutPassword };
    }
    static async lockAccount(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new appError_1.NotFound("User not found");
        user.isLocked = !user.isLocked;
        await this.userRepo.save(user);
        sessionStore_1.sessionStore.deleteAllForUser(user.id);
    }
    static async resetPassword(email, otp, newPass) {
        const isValid = otpStore_1.otpStore.verify(email, otp);
        if (!isValid)
            throw new Error("Invalid or expired OTP");
        const user = await this.userRepo.findOne({ where: { email: email.toLowerCase().trim() } });
        if (!user)
            throw new appError_1.UnauthorisedError('Authorization required.');
        user.passwordHash = await (0, password_1.hashPassword)(newPass);
        const saveduser = await this.userRepo.save(user);
        otpStore_1.otpStore.remove(email);
        const { passwordHash, ...userWithoutPassword } = saveduser;
        return userWithoutPassword;
    }
    static async requestOTP(email) {
        const user = await this.userRepo.findOne({ where: { email: email.toLowerCase().trim() } });
        if (!user)
            throw new appError_1.UnauthorisedError('Authorization required.');
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60000);
        otpStore_1.otpStore.create(email, generatedOTP, expiry);
        return generatedOTP;
    }
}
exports.AuthService = AuthService;
AuthService.userRepo = datasource_1.default.getRepository(Users_1.Users);
