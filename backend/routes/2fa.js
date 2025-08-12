// backend/routes/2fa.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { requestOtp, verifyOtp } = require('../controllers/otpController');

// 2FA code request/resend endpoint
router.post(
  '/request-2fa',
  [
    body('userId').isString(),
    body('via').isIn(['email', 'sms']),
    body('contact').isString(),
  ],
  requestOtp
);

// 2FA verification endpoint
router.post(
  '/verify-2fa',
  [
    body('userId').isString(),
    body('otp').isLength({ min: 6, max: 6 }),
  ],
  verifyOtp
);

module.exports = router;
