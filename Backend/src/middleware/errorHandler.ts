import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
    const isDev = process.env.NODE_ENV !== 'production';

    if(err instanceof AppError && err.isOperational){
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        })
    }

    console.log("Error: ", err);

    res.status(500).json({
        status: "error",
        message: "Something went wrong.",
        stack: isDev ? err.stack : undefined;
    })
}