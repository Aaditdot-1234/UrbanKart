import rateLimit from "express-rate-limit";
 
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        status: 429,
        message: 'Too many login attempts. Please wait 15 minutes.'
    },
    standardHeaders: true
})
 
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: 429,
        message: 'Too many requests. Please wait 15 minutes.'
    }
})