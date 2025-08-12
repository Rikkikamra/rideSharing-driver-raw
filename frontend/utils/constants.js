/**
 * Centralised constants for external services and domains.  Move any
 * hard‑coded URLs or keys from components into this module so they
 * can be configured via environment variables or build settings.
 */

import { WEATHER_API_KEY, SUPPORT_URL, API_BASE_URL, SOCKET_BASE_URL } from '@env';

export const WEATHER_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather`;
export const WEATHER_DEFAULT_CITY = 'Austin';
export const WEATHER_UNITS = 'imperial';
export const SUPPORT_CHAT_URL = SUPPORT_URL || 'https://swiftcampus-support.chatbot.com';

// Re‑export API base URLs to avoid importing from @env in many places
export { API_BASE_URL, SOCKET_BASE_URL };