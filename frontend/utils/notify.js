
import axios from 'axios';

export const sendNotification = async (type, payload) => {
  try {
    await axios.post('https://api.swiftcampus.com/api/notify', {
      type,
      data: payload
    });
    console.log(`Notification sent: ${type}`);
  } catch (error) {
    console.error(`Notification failed: ${type}`, error);
  }
};
