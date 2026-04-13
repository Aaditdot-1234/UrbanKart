"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_NAME = exports.JWT_SECRET = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const sessionStore_1 = require("../utils/sessionStore");
const datasource_1 = __importDefault(require("../datasource"));
const Users_1 = require("../entities/Users");
exports.JWT_SECRET = process.env.JWT_SECRET ?? 'dev.jwt-secret-change-me';
exports.COOKIE_NAME = 'access_token';
const cookieExtractor = (req) => {
    return req?.cookies?.[exports.COOKIE_NAME] ?? null;
};
passport_1.default.use(new passport_jwt_1.Strategy({ jwtFromRequest: cookieExtractor, secretOrKey: exports.JWT_SECRET }, async (payload, done) => {
    try {
        const session = sessionStore_1.sessionStore.get(payload.jti);
        if (!session)
            return done(null, false);
        const user = await datasource_1.default.getRepository(Users_1.Users).findOneBy({ id: payload.sub });
        if (!user)
            return done(null, false);
        return done(null, { ...user, jti: payload.jti });
    }
    catch (error) {
        return done(error, false);
    }
}));
