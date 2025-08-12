// backend/utils/pushHelper.js

const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service-account.json');

// Initialize Firebase admin SDK once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

/**
 * Sends a push notification via FCM.
 * @param {string} toToken  The FCM device token
 * @param {string} title    Notification title
 * @param {string} body     Notification body
 */
exports.sendPushNotification = async (toToken, title, body) => {
  const message = {
    token: toToken,
    notification: { title, body }
  };
  return admin.messaging().send(message);
};
