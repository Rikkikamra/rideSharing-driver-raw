// frontend/screens/auth/LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation }      from '@react-navigation/native';
import { useNotification }    from '../../context/NotificationContext';
import { loginUser }          from '../../utils/api';
import { getApplicationStatus } from '../../utils/api';
// Use theme variables from the root theme file.  Because this screen lives in
// the auth directory, we need to go up two directories to import the
// shared theme instead of the non‑existent '../theme'.
import { COLORS, FONTS, BORDERS } from '../../theme';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { notify } = useNotification();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword]         = useState('');
  const [isLoading, setIsLoading]       = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      return Alert.alert('Missing fields', 'Please enter both email/phone and password.');
    }

    setIsLoading(true);
    try {
      // 1) perform login
      const { token } = await loginUser({ emailOrPhone, password });
      // (store token in AsyncStorage or via your AuthContext here…)

      // 2) check driver-onboarding status
      const { status } = await getApplicationStatus();
      if (status === 'in_review') {
        notify({ title: 'Under Review', message: 'Your application is being reviewed.' });
        return navigation.replace('ApplicationInReview');
      }

      // 3) on success, drop into the main app
      notify({ title: 'Welcome Back', message: 'Login successful!' });
      navigation.replace('MainApp');
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Login Failed', err.response?.data?.message || err.message || 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <Text style={styles.label}>Email or Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Email or Phone"
        placeholderTextColor={COLORS.grey}
        autoCapitalize="none"
        keyboardType="email-address"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.grey}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading
          ? <ActivityIndicator color={COLORS.white} />
          : <Text style={styles.buttonText}>Log In</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.link}>
          Don’t have an account? <Text style={styles.linkAccent}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.size.title,
    fontFamily: FONTS.bold,
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    color: COLORS.black,
    fontSize: FONTS.size.input,
    fontFamily: FONTS.medium,
    marginBottom: 6,
  },
  input: {
    borderWidth: BORDERS.width,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDERS.radius,
    backgroundColor: COLORS.inputBg,
    fontSize: FONTS.size.input,
    fontFamily: FONTS.regular,
    padding: 14,
    marginBottom: 18,
    color: COLORS.black,
  },
  button: {
    backgroundColor: COLORS.burntOrange,
    borderRadius: BORDERS.radius,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONTS.size.button,
  },
  link: {
    color: COLORS.black,
    fontSize: FONTS.size.link,
    textAlign: 'center',
  },
  linkAccent: {
    color: COLORS.burntOrangeLight,
    fontWeight: 'bold',
  },
});
