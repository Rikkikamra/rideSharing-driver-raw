// File: utils/supportChatAPI.js

import api from './api'; // your existing axios instance
// If you want to use the instance from root/utils/api.js, this will work.

export async function fetchSupportMessages(conversationId = null) {
  try {
    // Optionally pass a conversationId if needed, or remove from URL if not used
    const url = conversationId
      ? `/support/messages/${conversationId}`
      : `/support/messages`;
    const response = await api.get(url);
    return response.data?.messages || []; // Adjust shape as per your backend
  } catch (error) {
    // You might want to log, notify, or handle specific error cases here
    console.error('Failed to fetch support messages:', error);
    throw error; // Optionally re-throw for UI to handle
  }
}

export async function sendSupportMessage(message, conversationId = null) {
  try {
    // Optionally pass a conversationId if your backend needs it
    const url = conversationId
      ? `/support/messages/${conversationId}`
      : `/support/messages`;
    const response = await api.post(url, { message });
    // Return the newly created message object, or whatever your backend sends
    return response.data?.message || {
      from: 'user',
      text: message,
      time: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to send support message:', error);
    throw error;
  }
}
