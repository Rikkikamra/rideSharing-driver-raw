// frontend/screens/auth/SignupScreen.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthRequest, ResponseType } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, BORDERS } from '../../theme';
import { API_BASE_URL } from '@env';
import { useNotification } from '../../context/NotificationContext';

// Helper: calculate password strength score (0–4)
function getPasswordScore(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

// Colour mapping for password strength.  Because the original theme did not
// define warning/primary/success colours, we pick sensible values.  Feel
// free to adjust these to match your brand palette.
const PASSWORD_STRENGTH_COLORS = [
  COLORS.error,
  COLORS.burntOrangeLight,
  COLORS.burntOrange,
  '#2e7d32', // success green
];

const SignupScreen = ({ navigation }) => {
  const { notify } = useNotification();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Google OAuth setup
  const [request, googleResponse, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.IdToken,
      expoClientId: process.env.GOOGLE_EXPO_CLIENT_ID,
      iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
      androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
      webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    },
    { useProxy: true }
  );

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleGoogleSignIn(googleResponse.params.id_token);
    }
  }, [googleResponse]);

  // Sign‑up handler
  const handleSignup = async () => {
    setError('');
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setError('Please agree to the Terms & Conditions.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Signup failed.');
      } else {
        // store token and navigate
        // Persist your API token for future authenticated requests.  Store
        // both a legacy key (`token`) and a new `authToken` key to
        // maintain compatibility with parts of the app that still read
        // from `AsyncStorage.getItem('token')`.
        await AsyncStorage.setItem('authToken', json.token);
        await AsyncStorage.setItem('token', json.token);
        // Indicate that the user registered using email/password
        await AsyncStorage.setItem('authProvider', 'email');
        notify({ title: 'Welcome', message: 'Account created successfully!' });
        navigation.replace('MainApp');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google handlers
  const handleGoogleSignup = () => promptAsync();
  const handleGoogleSignIn = async (idToken) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google-signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Google sign‑in failed.');
      } else {
        // Persist your API token under both `token` and `authToken` keys
        await AsyncStorage.setItem('authToken', json.token);
        await AsyncStorage.setItem('token', json.token);
        // Persist which provider was used so we can sign out later.
        await AsyncStorage.setItem('authProvider', 'google');
        // Persist the Google idToken for logout.  Without this value we
        // cannot call Google.logOutAsync() to revoke the session.
        await AsyncStorage.setItem('googleIdToken', idToken);
        notify({ title: 'Welcome', message: 'Login successful!' });
        navigation.replace('MainApp');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Apple sign‑in
  const handleAppleSignup = async () => {
    setIsLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const res = await fetch(`${API_BASE_URL}/auth/apple-signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential.identityToken }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Apple sign‑in failed.');
      } else {
        // Persist your API token under both keys
        await AsyncStorage.setItem('authToken', json.token);
        await AsyncStorage.setItem('token', json.token);
        // Record provider for later logout and store the identity token.
        await AsyncStorage.setItem('authProvider', 'apple');
        if (credential?.identityToken) {
          await AsyncStorage.setItem('appleIdToken', credential.identityToken);
        }
        notify({ title: 'Welcome', message: 'Login successful!' });
        navigation.replace('MainApp');
      }
    } catch (err) {
      setError('Apple sign‑in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordScore = getPasswordScore(password);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Sign Up</Text>

        {/* error banner */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={[styles.passwordStrength, { color: PASSWORD_STRENGTH_COLORS[passwordScore] }]}>
          Password strength: {['Very Weak', 'Weak', 'Medium', 'Strong'][passwordScore]}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {/* Terms checkbox placeholder: implement your own checkbox component here */}
        <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)} style={styles.checkboxRow}>
          <View style={[styles.checkbox, termsAccepted && { backgroundColor: COLORS.burntOrange }]} />
          <Text style={styles.checkboxLabel}>I agree to the Terms & Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        {/* Social sign in buttons */}
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: COLORS.googleBlue }]} onPress={handleGoogleSignup}>
          <Text style={styles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        {AppleAuthentication.isAvailableAsync && (
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: COLORS.black }]} onPress={handleAppleSignup}>
            <Text style={styles.socialButtonText}>Sign in with Apple</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.size.title,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: BORDERS.width,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDERS.radius,
    padding: 14,
    marginBottom: 12,
    fontSize: FONTS.size.input,
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.inputBg,
    color: COLORS.black,
  },
  passwordStrength: {
    marginBottom: 8,
    fontSize: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: FONTS.size.input,
  },
  button: {
    backgroundColor: COLORS.burntOrange,
    borderRadius: BORDERS.radius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONTS.size.button,
  },
  socialButton: {
    borderRadius: BORDERS.radius,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  socialButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONTS.size.button,
  },
});

export default SignupScreen;