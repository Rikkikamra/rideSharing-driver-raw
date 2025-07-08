
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendWelcomeEmail = async (email, name) => {
  const msg = {
    to: email,
    from: 'noreply@swiftcampus.com',
    subject: 'Welcome to SwiftCampus!',
    html: `<p>Hi ${name},</p><p>Welcome to the SwiftCampus Driver platform! We're excited to have you onboard.</p><p>Drive smart. Drive safe.</p>`,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message);
  }
};
