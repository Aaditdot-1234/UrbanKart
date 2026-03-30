import AppDataSource from "../datasource";
import { UserRole, Users } from "../entities/Users";
import { ConflictError, NotFound, UnauthorisedError, ValidationError } from "../errors/appError";
import { hashPassword, VerifyPassword } from "../auth/password";
import { signToken } from "../auth/jwt";
import { sessionStore } from "../utils/sessionStore";
import { v4 as uuidV4 } from 'uuid';

export class AuthService {
    private static userRepo = AppDataSource.getRepository(Users);

    static async register(data: Users) {
        const { name, email, passwordHash, phone, address } = data;
        const password = passwordHash;

        if (!name || !email || !password || !phone || !address) {
            throw new ValidationError('Missing fields: Name, Email, Password, Phone, and Address are required.');
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await this.userRepo.findOne({ where: { email: normalizedEmail } });

        if (existingUser) throw new ConflictError("User with this email already exists.");

        const hashedPassword = await hashPassword(password);
        const user = this.userRepo.create({
            name,
            email: normalizedEmail,
            role: UserRole.Customer,
            isActive: true,
            passwordHash: hashedPassword,
            phone,
            address,
        });

        return await this.userRepo.save(user);
    }

    static async login(email: string, pass: string, meta: { userAgent: string; ip: string }) {
        if (!email || !pass) throw new ValidationError("Email and Password are required.");

        const user = await this.userRepo.createQueryBuilder('users')
            .addSelect('users.passwordHash')
            .where('users.email = :email', { email: email.toLowerCase().trim() })
            .getOne();

        if (!user) throw new NotFound("User not found.");

        const isValid = await VerifyPassword(user.passwordHash, pass);
        if (!isValid) throw new ValidationError("Invalid credentials.");

        if (user.isLocked) throw new UnauthorisedError("Account is locked by admin.");

        const jti = uuidV4();
        const token = signToken({ sub: user.id, email: user.email, role: user.role, jti });

        sessionStore.create(jti, {
            userId: user.id,
            userName: user.name,
            createdAt: new Date(),
            userAgent: meta.userAgent,
            ip: meta.ip
        });

        return { token, user };
    }

    static async lockAccount(userId: string) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFound("User not found");

        user.isLocked = true;
        await this.userRepo.save(user);

        sessionStore.deleteAllForUser(user.id);
    }

    static async resetPassword(email: string, newPass: string) {
        const user = await this.userRepo.findOne({ where: { email: email.toLowerCase().trim() } });
        if (!user) throw new UnauthorisedError('Authorization required.');

        user.passwordHash = await hashPassword(newPass);
        await this.userRepo.save(user);
    }
}