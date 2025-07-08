// Tracks user's quiet ride preference and stores it for smart matching
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getQuietPreference() {
  const val = await AsyncStorage.getItem('quiet_ride_pref');
  return val === 'true';
}

export async function setQuietPreference(value) {
  await AsyncStorage.setItem('quiet_ride_pref', value ? 'true' : 'false');
}
