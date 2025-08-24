import rateLimit from 'express-rate-limit';

export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Max 3 OTP requests per windowMs
    message: 'Too many OTP requests. Please try again later.'
});