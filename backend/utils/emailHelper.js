// backend/utils/emailHelper.js

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Welcome email (unchanged).
 */
exports.sendWelcomeEmail = async (email, name) => {
  const msg = {
    to: email,
    from: 'noreply@swiftcampus.com',
    subject: 'Welcome to SwiftCampus',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for joining our platform. Let’s get started!</p>
    `
  };
  await sgMail.send(msg);
};

/**
 * Notifies user that their application is under review.
 */
exports.sendApplicationInReviewEmail = async (email, name) => {
  const msg = {
    to: email,
    from: 'noreply@swiftcampus.com',
    subject: 'Your Driver Application Is Under Review',
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for applying! Your driver application is now under review. We’ll notify you when there’s an update.</p>
    `
  };
  await sgMail.send(msg);
};

/**
 * Notifies user of application approval.
 */
exports.sendApplicationApprovedEmail = async (email, name) => {
  const msg = {
    to: email,
    from: 'noreply@swiftcampus.com',
    subject: 'Congratulations! Your Application Is Approved',
    html: `
      <p>Hi ${name},</p>
      <p>Great news—your driver application has been <strong>approved</strong>! 🎉 You can now accept rides.</p>
    `
  };
  await sgMail.send(msg);
};

/**
 * Notifies user of application rejection.
 */
exports.sendApplicationRejectedEmail = async (email, name) => {
  const msg = {
    to: email,
    from: 'noreply@swiftcampus.com',
    subject: 'Your Driver Application Has Been Rejected',
    html: `
      <p>Hi ${name},</p>
      <p>We’re sorry—your application was not approved.</p>
      <p>Please review your details and resubmit.</p>
    `
  };
  await sgMail.send(msg);
};
