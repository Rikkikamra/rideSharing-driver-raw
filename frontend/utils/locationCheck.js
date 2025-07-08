// Checks if location permission is granted and returns a boolean
import * as Location from 'expo-location';

export async function isLocationEnabled() {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
}
