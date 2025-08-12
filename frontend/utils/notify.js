import axios from 'axios';
import { API_BASE_URL } from '@env';

/**
 * Send a notification via the backend notify service.  This helper avoids
 * using React hooks outside of a component and centralises the API
 * endpoint so that it respects the configured API base URL.
 *
 * @param {string} type    Type of notification (e.g. 'email', 'sms')
 * @param {object} payload Notification payload; structure depends on the type
 */
export async function sendNotification(type, payload) {
  try {
    await axios.post(`${API_BASE_URL}/notify`, {
      type,
      data: payload,
    });
  } catch (err) {
    console.error('Notification failed:', err);
  }
}
