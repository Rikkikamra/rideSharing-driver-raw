// --- Public vehicle data from NHTSA (unchanged) ---

/**
 * Fetch all makes from NHTSA public API.
 * Returns: Array of { label, value } pairs for dropdowns.
 */
export async function fetchMakes() {
  try {
    const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json');
    const data = await response.json();
    return data.Results.map(item => ({ label: item.Make_Name, value: item.Make_Name }));
  } catch (error) {
    console.error('Error fetching makes:', error);
    return [];
  }
}

/**
 * Fetch all models for a make from NHTSA public API.
 * Returns: Array of { label, value } pairs for dropdowns.
 */
export async function fetchModels(make) {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`);
    const data = await response.json();
    return data.Results.map(item => ({ label: item.Model_Name, value: item.Model_Name }));
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

// --- Private vehicle data from your backend (enhanced, production ready) ---

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Use API_BASE_URL from the expo environment.  Do not fall back to localhost
// in production since that breaks mobile builds.  The variable should be
// defined in your .env file via expo constants.  See utils/api.js for
// similar usage.
import { API_BASE_URL } from '@env';

// Optional: Replace with your own error UI (Toast, Snackbar, etc.)
function showErrorBanner(message) {
  if (typeof window !== "undefined" && window.alert) {
    window.alert(message);
  } else {
    console.error("Error:", message);
  }
}

const MAX_RETRIES = 2;

async function getAuthToken() {
  return await AsyncStorage.getItem('token');
}
async function getRefreshToken() {
  return await AsyncStorage.getItem('refreshToken');
}
async function setAuthToken(token) {
  return await AsyncStorage.setItem('token', token);
}

// Attempts to refresh token if expired
async function refreshAuthToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error("Missing refresh token. Please login again.");
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
    if (res.data && res.data.accessToken) {
      // Persist the new access token.  Also update the stored
      // refresh token if provided.  This mirrors the behaviour of
      // utils/api.js when handling automatic token refresh.
      await setAuthToken(res.data.accessToken);
      if (res.data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
      }
      return res.data.accessToken;
    } else {
      throw new Error("Invalid refresh response");
    }
  } catch (error) {
    throw new Error("Session expired. Please log in again.");
  }
}

/**
 * Fetch vehicles registered by the currently logged-in driver (private, authenticated).
 * Returns: Array of vehicle objects.
 */
export async function fetchVehiclesAPI(options = {}) {
  let retries = 0;
  let token = await getAuthToken();

  while (retries <= MAX_RETRIES) {
    try {
      if (!token) throw new Error("You are not logged in. Please log in.");

      const response = await axios.get(`${API_BASE_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // 10s timeout
      });

      // Defensive response validation
      if (
        !response.data ||
        response.data.success !== true ||
        !Array.isArray(response.data.vehicles)
      ) {
        throw new Error("Unexpected response from server.");
      }

      // Success!
      return response.data.vehicles;

    } catch (error) {
      // If unauthorized (JWT expired or invalid), try refresh ONCE
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403) &&
        retries === 0 // Only refresh once
      ) {
        try {
          token = await refreshAuthToken();
          retries++; // Don't count as full retry, as this is token renewal
          continue; // Retry with new token
        } catch (refreshErr) {
          showErrorBanner(refreshErr.message || "Session expired. Please log in again.");
          throw refreshErr;
        }
      }

      // Retry for network/server errors (not auth errors)
      if (
        (!error.response || error.response.status >= 500) &&
        retries < MAX_RETRIES
      ) {
        retries++;
        await new Promise(res => setTimeout(res, 300 * Math.pow(2, retries))); // 600ms, 1200ms
        continue;
      }

      // All other errors: show error and throw
      let msg =
        error.response?.data?.message ||
        error.message ||
        "Unknown error fetching vehicles.";
      showErrorBanner(msg);
      throw error;
    }
  }
  // If here, max retries exhausted
  const finalMsg = "Unable to fetch vehicles. Please check your connection and try again.";
  showErrorBanner(finalMsg);
  throw new Error(finalMsg);
}
