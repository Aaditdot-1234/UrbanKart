export class AppError extends Error {
    public readonly statusCode!: number;
    public readonly isOperational!: boolean;
    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype)
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFound extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthorisedError extends AppError {
    constructor(message = 'Authentication required.') {
        super(message, 401);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'You do not have permission to perform this action.') {
        super(message, 403);
    }
}
export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}