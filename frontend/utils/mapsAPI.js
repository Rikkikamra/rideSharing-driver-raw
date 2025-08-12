// frontend/utils/mapsAPI.js
import axios from 'axios';
import { API_BASE_URL } from '@env';

export async function fetchRoute(from, to) {
  const response = await axios.get(`${API_BASE_URL}/maps/directions`, {
    params: { from, to }
  });
  return response.data; // { fromLocation, toLocation, routeCoordinates }
}
