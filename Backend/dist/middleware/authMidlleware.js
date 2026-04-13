"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
exports.requireAdmin = requireAdmin;
const appError_1 = require("../errors/appError");
const Users_1 = require("../entities/Users");
const passport_1 = __importDefault(require("passport"));
const requireAuth = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user) => {
        if (err)
            return next(err);
        if (!user) {
            throw new appError_1.UnauthorisedError("Invalid or expired session.");
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.requireAuth = requireAuth;
function requireAdmin(req, res, next) {
    const user = req.user;
    if (!user) {
        throw new appError_1.UnauthorisedError("Authorization required");
    }
    if (user.role !== Users_1.UserRole.Admin) {
        throw new appError_1.UnauthorisedError("Access denied. Admin prvilleges required.");
    }
    next();
}
