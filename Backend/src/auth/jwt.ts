import jwt, {JwtPayload as BaseJwtPayload} from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev.jwt-secret-change-me';
const JWT_EXPIRY = '1h';

export type JwtPayload = BaseJwtPayload & {
    sub:number,
    email:string, 
    role:string,
}

export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string{
    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRY})
}

export function verifyToken(token: string): JwtPayload{
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}