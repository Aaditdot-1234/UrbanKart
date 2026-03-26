import { NextFunction, Request, Response } from "express";
import { NotFound, UnauthorisedError, ValidationError } from "../errors/appError";
import { SessionStore } from "../utils/sessionStore";
import { JwtPayload, verifyToken } from "../auth/jwt";
import AppDataSource from "../datasource";
import { UserRole, Users } from "../entities/Users";

export async function requireJwt(req: Request, res: Response, next: NextFunction){
    const token = req.cookies.access_token;

    if(!token){
        throw new UnauthorisedError("No token provided");
    }
    try{
        const payload: JwtPayload = verifyToken(token);
        const session = SessionStore.get(payload.sub);
        
        const userRepo = AppDataSource.getRepository(Users);
        const user = await userRepo.findOne({where: {id: payload.sub}})
        
        if(!user){
            throw new NotFound("User not found");
        }

        if(!session){
            res.clearCookie('access_token');
            throw new UnauthorisedError('Session expired or account locked');
        }

        req.user = user;
        next();
    }catch(err){
        throw new UnauthorisedError("Invalid or expired session.");
    }
}

export function requireAdmin(req:Request, res: Response, next: NextFunction){
    const user = (req as any).user;

    if(!user){
        throw new UnauthorisedError("Authorization required");
    }

    if(user.role !== UserRole.Admin){
        throw new UnauthorisedError("Access denied. Admin prvilleges required.");
    }

    next();
}