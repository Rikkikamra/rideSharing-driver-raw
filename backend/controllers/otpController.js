// backend/controllers/otpController.js

const { validationResult } = require('express-validator');
const Redis = require('ioredis');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

// Setup services
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP({ via, contact, otp }) {
  if (via === 'email') {
    await sgMail.send({
      to: contact,
      from: 'noreply@swiftcampus.com',
      subject: 'Your SwiftCampus Verification Code',
      text: `Your code is: ${otp}`,
    });
  } else {
    await twilioClient.messages.create({
      to: contact,
      from: process.env.TWILIO_FROM_NUMBER,
      body: `Your SwiftCampus verification code is: ${otp}`,
    });
  }
}

/**
 * Controller: Request/resend OTP
 */
exports.requestOtp = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.status(400).json({ errors: errs.array() });
  }
  const { userId, via, contact } = req.body;
  const otp = generateOTP();

  try {
    // store for 5m
    await redis.setex(`otp:${userId}`, 300, otp);
    await sendOTP({ via, contact, otp });
    return res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error('request-2fa error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

/**
 * Controller: Verify OTP
 */
exports.verifyOtp = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.status(400).json({ errors: errs.array() });
  }

  const { userId, otp } = req.body;
  try {
    const stored = await redis.get(`otp:${userId}`);
    if (!stored) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    if (stored !== otp) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid OTP' });
    }

    await redis.del(`otp:${userId}`);
    return res.json({ success: true, message: 'OTP verified' });
  } catch (err) {
    console.error('verify-2fa error:', err);
    return res.status(500).json({
      success: false,
      message: 'Verification error',
    });
  }
};
