// frontend/utils/api.js

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';

// ---- SecureStore keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// ---- SecureStore helpers
async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

async function setAccessToken(token) {
  return SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token, {
    keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
  });
}

async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

async function setRefreshToken(token) {
  return SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token, {
    keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
  });
}

async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  delete apiClient.defaults.headers.common.Authorization;
}

// ---- Axios client setup (single instance)
const apiClient = axios.create({
  baseURL: API_BASE_URL, // should already include /api
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token on each request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Token refresh queue + flags
let isRefreshing = false;
let failedQueue = [];

/**
 * Avoid infinite loops: mark refresh requests so the interceptor
 * will NOT try to refresh again if they 401.
 */
const REFRESH_FLAG = '_isRefreshRequest';

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// Handle 401s → refresh once, replay queued requests
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error || {};

    // Network errors or canceled requests
    if (!response || !config) return Promise.reject(error);

    // If the refresh call itself failed, do not loop
    if (config[REFRESH_FLAG]) {
      await clearTokens();
      return Promise.reject(error);
    }

    if (response.status === 401 && !config._retry) {
      config._retry = true;

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(config);
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');

        // Use the SAME client, but mark this request so we don't recurse
        const { data } = await apiClient.post(
          '/auth/refresh-token',
          { refreshToken },
          { [REFRESH_FLAG]: true }
        );

        const { accessToken, refreshToken: newRT } = data || {};
        if (!accessToken || !newRT) throw new Error('Invalid refresh response');

        await setAccessToken(accessToken);
        await setRefreshToken(newRT);

        // Set default Authorization for subsequent requests
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // Unblock queued requests
        processQueue(null, accessToken);

        // Retry the original request with the new token
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(config);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ---- Auth flows

/**
 * Log in a user and store tokens.
 * @param {{ email: string, password: string }} credentials
 */
export async function login(credentials) {
  const { data } = await apiClient.post('/auth/login', credentials);
  await setAccessToken(data.accessToken);
  await setRefreshToken(data.refreshToken);
  apiClient.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
  return data;
}

/**
 * Log out user, clear tokens, notify server.
 */
export async function logout() {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    await clearTokens();
  }
}

/**
 * Back-compat alias for login()
 */
export async function loginUser(credentials) {
  return login(credentials);
}

/**
 * Get the current driver onboarding application status.
 */
export async function getApplicationStatus() {
  const { data } = await apiClient.get('/driver/onboarding/status');
  return data;
}

// ---- Trip Feedback APIs

export async function submitTripFeedback(tripId, payload) {
  const { data } = await apiClient.post(`/feedback/${tripId}`, payload);
  return data;
}

export async function fetchTripFeedback(tripId) {
  const { data } = await apiClient.get(`/feedback/${tripId}`);
  return data;
}

export async function fetchUserRatings(userId) {
  const { data } = await apiClient.get(`/feedback/user/${userId}`);
  return data;
}

// ---- Driver Score API

export async function fetchDriverScore() {
  const { data } = await apiClient.get('/drivers/score');
  return data;
}

// ---- Trip Chat APIs (if used)

export async function fetchTripChatMessages(tripId) {
  const { data } = await apiClient.get(`/chats/trip/${tripId}`);
  return data.messages;
}

export async function sendTripChatMessage(tripId, text) {
  const { data } = await apiClient.post(`/chats/trip/${tripId}`, { text });
  return data.message;
}

// ---- Rides / Earnings APIs

export async function fetchAvailableRides() {
  try {
    const { data } = await apiClient.get('/rides');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('fetchAvailableRides error:', err);
    return [];
  }
}

export async function fetchDriverEarnings() {
  try {
    const { data } = await apiClient.get('/drivers/earnings');
    if (data && typeof data === 'object') {
      const { day = 0, week = 0, month = 0 } = data;
      return { day, week, month };
    }
    return { day: 0, week: 0, month: 0 };
  } catch (err) {
    console.error('fetchDriverEarnings error:', err);
    return { day: 0, week: 0, month: 0 };
  }
}

// Expose token helper for Socket.io auth
export { getAccessToken };

// ---- 2FA APIs

export async function sendTwoFACode(userId, via = 'email', contact) {
  const payload = { userId, via };
  if (contact) payload.contact = contact;
  const { data } = await apiClient.post('/2fa/request-2fa', payload);
  return data;
}

export async function verifyTwoFACode(userId, code) {
  const { data } = await apiClient.post('/2fa/verify-2fa', {
    userId,
    otp: code,
  });
  return data;
}

// ---- Promo Codes

export async function applyPromoCode(code) {
  const { data } = await apiClient.post('/promo/validate', { code });
  if (data && data.valid) {
    return { success: true, discount: data.discount };
  }
  return { success: false, message: data?.message || 'Invalid promo code.' };
}

// ---- Ride Types

export async function getRideTypes() {
  const { data } = await apiClient.get('/ridetypes');
  return data;
}

export default apiClient;
