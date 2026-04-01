import { Request } from "express"
import { Strategy as JwtStrategy } from "passport-jwt";
import passport from "passport";
import { sessionStore } from "../utils/sessionStore";
import AppDataSource from "../datasource";
import { Users } from "../entities/Users";

export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev.jwt-secret-change-me';
export const COOKIE_NAME = 'access_token';

const cookieExtractor = (req: Request): string | null => {
    return req?.cookies?.[COOKIE_NAME] ?? null;
}

passport.use(
    new JwtStrategy(
        { jwtFromRequest: cookieExtractor, secretOrKey: JWT_SECRET },
        async (payload: { sub: string, jti: string }, done) => {
            try {
                const session = sessionStore.get(payload.jti);
                if (!session) return done(null, false);

                const user = await AppDataSource.getRepository(Users).findOneBy({ id: payload.sub });
                if (!user) return done(null, false);

                return done(null, { ...user, jti: payload.jti });
            } catch (error) {
                return done(error, false);
            }
        }
    )
)