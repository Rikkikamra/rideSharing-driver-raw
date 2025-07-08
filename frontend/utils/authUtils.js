
import * as Google from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

export const logoutSocialAccount = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    await AsyncStorage.clear();

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const googleClientId = 'YOUR_GOOGLE_CLIENT_ID_HERE';
      await Google.Google.logOutAsync({ accessToken: token, clientId: googleClientId });
    }

    Alert.alert('Logged out successfully');
  } catch (err) {
    console.error('Logout error:', err);
    Alert.alert('Logout failed', err.message);
  }
};
