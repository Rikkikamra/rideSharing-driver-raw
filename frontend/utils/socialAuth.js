import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

export const signInWithGoogle = async () => {
  try {
    const { type, authentication } = await Google.useAuthRequest({
      expoClientId: '<YOUR_EXPO_CLIENT_ID>',
      iosClientId: '<YOUR_IOS_CLIENT_ID>',
      androidClientId: '<YOUR_ANDROID_CLIENT_ID>',
      webClientId: '<YOUR_WEB_CLIENT_ID>',
    });
    if (type === 'success') {
      return authentication;
    }
  } catch (error) {
    console.error('Google Sign-In Error:', error);
  }
  return null;
};

export const signInWithApple = async () => {
  if (Platform.OS === 'ios') {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      return credential;
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
    }
  }
  return null;
};