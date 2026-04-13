"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const appError_1 = require("../errors/appError");
function errorHandler(err, req, res, next) {
    const isDev = process.env.NODE_ENV !== 'production';
    if (err instanceof appError_1.AppError && err.isOperational) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    console.log("Error: ", err);
    res.status(500).json({
        status: "error",
        message: "Something went wrong.",
        stack: isDev ? err.stack : undefined,
    });
}
