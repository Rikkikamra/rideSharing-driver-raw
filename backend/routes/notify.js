const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/', async (req, res) => {
  const { type, data } = req.body;

  try {
    if (type === 'email') {
      await sgMail.send({
        to: data.to,
        from: 'noreply@swiftcampus.com',
        subject: data.subject,
        text: data.text,
      });
    } else if (type === 'sms') {
      await twilioClient.messages.create({
        body: data.message,
        from: '+1234567890',
        to: data.to,
      });
    }
    res.status(200).json({ message: 'Notification sent' });
  } catch (err) {
    res.status(500).json({ message: 'Notification failed', error: err.message });
  }
});

module.exports = router;
