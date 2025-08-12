import axios from 'axios';
import { WEATHER_ENDPOINT, WEATHER_DEFAULT_CITY, WEATHER_UNITS } from './constants';
import { WEATHER_API_KEY } from '@env';

/**
 * Fetch current weather for the specified coordinates.  Falls back to
 * the configured default city if latitude/longitude are not provided.
 * The API key is loaded from the environment via `@env`.
 *
 * @param {number} lat
 * @param {number} lon
 */
export async function fetchWeather(lat, lon) {
  try {
    const apiKey = WEATHER_API_KEY;
    const params = new URLSearchParams();
    params.append('units', WEATHER_UNITS || 'imperial');
    params.append('appid', apiKey);
    if (lat != null && lon != null) {
      params.append('lat', lat);
      params.append('lon', lon);
    } else {
      params.append('q', WEATHER_DEFAULT_CITY || 'Austin');
    }
    const url = `${WEATHER_ENDPOINT}?${params.toString()}`;
    const response = await axios.get(url);
    if (response.data) {
      const { weather, main, wind, name } = response.data;
      return {
        city: name,
        main: weather[0]?.main,
        desc: weather[0]?.description,
        temp: Math.round(main.temp),
        wind: wind.speed,
        icon: weather[0]?.icon,
      };
    }
    return null;
  } catch (err) {
    console.error('weather fetch error', err);
    return null;
  }
}
