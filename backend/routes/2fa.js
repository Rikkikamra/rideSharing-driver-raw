const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const otpStore = new Map(); // { userId: { otp, expiresAt } }

router.post('/request-2fa', async (req, res) => {
  const { userId, method, contact } = req.body;
  if (!userId || !method || !contact) {
    return res.status(400).json({ message: 'userId, method, and contact are required' });
  }

  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(userId, { otp, expiresAt });

  try {
    if (method === 'email') {
      await sgMail.send({
        to: contact,
        from: 'noreply@swiftcampus.com',
        subject: 'Your SwiftCampus Verification Code',
        text: `Your code is: ${otp}`,
      });
    } else if (method === 'sms') {
      await twilioClient.messages.create({
        body: `Your SwiftCampus verification code is: ${otp}`,
        from: '+1234567890',
        to: contact,
      });
    }

    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

router.post('/verify-2fa', (req, res) => {
  const { userId, otp } = req.body;
  const entry = otpStore.get(userId);

  if (!entry) return res.status(400).json({ message: 'No OTP requested' });
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(userId);
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (otp !== entry.otp) return res.status(401).json({ message: 'Invalid OTP' });

  otpStore.delete(userId);
  res.status(200).json({ message: 'OTP verified successfully' });
});

module.exports = router;
