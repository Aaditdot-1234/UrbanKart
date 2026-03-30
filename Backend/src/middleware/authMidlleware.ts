import { NextFunction, Request, Response } from "express";
import { UnauthorisedError } from "../errors/appError";
import { UserRole, Users } from "../entities/Users";
import passport from "passport";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) return next(err);
    
    if (!user) {
      throw new UnauthorisedError("Invalid or expired session.");
    }

    req.user = user;
    next();
  })(req, res, next);
};

export function requireAdmin(req:Request, res: Response, next: NextFunction){
    const user = req.user as Users;

    if(!user){
        throw new UnauthorisedError("Authorization required");
    }

    if(user.role !== UserRole.Admin){
        throw new UnauthorisedError("Access denied. Admin prvilleges required.");
    }

    next();
}