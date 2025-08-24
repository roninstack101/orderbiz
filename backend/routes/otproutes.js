import express from 'express';
import {
  requestOTP,
  verifyOTP,
  requestPasswordReset,
  resetPassword
} from '../controller/otpcontroller.js';
import { otpLimiter } from '../middleware/rateLimit.js';


const router = express.Router();

// OTP routes with rate limiting
router.post('/request-otp', otpLimiter, requestOTP);
router.post('/verify-otp', verifyOTP);

// Password reset routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;