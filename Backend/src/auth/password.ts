import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
    return bcrypt.hash(password, SALT_ROUNDS);
} 

export async function VerifyPassword(hashPassword: string, password:string): Promise<Boolean> {
    return bcrypt.compare(password, hashPassword);
}