import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';

/**
 * Clear locally stored authentication tokens (both your API tokens and
 * provider tokens) from AsyncStorage.  This utility is used internally
 * after revoking provider sessions.  It is exported so that tests can
 * verify storage is reset.
 */
export async function clearLocalAuthStorage() {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('refreshToken');
    // Keep backward compatibility by also clearing legacy keys
    await AsyncStorage.removeItem('token');
    // Clear provider metadata
    await AsyncStorage.removeItem('authProvider');
    await AsyncStorage.removeItem('googleIdToken');
    await AsyncStorage.removeItem('appleIdToken');
  } catch (err) {
    console.error('Error clearing auth storage:', err);
  }
}

/**
 * Perform provider‑specific logout (Google/Apple) if applicable, then clear
 * local tokens.  This helper deliberately avoids React hooks so it can be
 * called from AuthProvider or any other non‑component context.  UI
 * components should call this when logging out instead of directly
 * manipulating AsyncStorage.
 */
export async function logoutSocialAccount() {
  try {
    const provider = await AsyncStorage.getItem('authProvider');
    if (provider === 'google') {
      // Retrieve the idToken stored during social login.  Without this
      // parameter the Expo Google logout will reject.  The client ID can
      // come from any of the platform‑specific IDs defined in your .env
      // (expoClientId, iosClientId, androidClientId, webClientId).  We
      // attempt to read them from process.env here; if undefined, the
      // logout call will fail silently.
      const idToken = await AsyncStorage.getItem('googleIdToken');
      // Determine the client ID by checking the various env variables
      const clientId =
        process.env.GOOGLE_EXPO_CLIENT_ID ||
        process.env.GOOGLE_IOS_CLIENT_ID ||
        process.env.GOOGLE_ANDROID_CLIENT_ID ||
        process.env.GOOGLE_WEB_CLIENT_ID ||
        undefined;
      if (idToken && clientId) {
        try {
          await Google.logOutAsync({ idToken, clientId });
        } catch (e) {
          console.warn('Google sign‑out failed:', e.message);
        }
      }
    } else if (provider === 'apple') {
      // Apple sign‑out is only available on iOS devices.  Use
      // signOutAsync to revoke the session.  If unavailable, ignore.
      if (Platform.OS === 'ios' && AppleAuthentication.signOutAsync) {
        try {
          await AppleAuthentication.signOutAsync();
        } catch (e) {
          console.warn('Apple sign‑out failed:', e.message);
        }
      }
    }
  } catch (err) {
    console.error('Social logout error:', err);
  } finally {
    await clearLocalAuthStorage();
  }
}