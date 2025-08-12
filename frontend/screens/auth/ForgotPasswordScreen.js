// frontend/screens/auth/ForgotPasswordScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNotification } from '../../context/NotificationContext';
import { sendPasswordReset } from '../../utils/api';
import { COLORS, FONTS, BORDERS } from '../../theme';

/**
 * ForgotPasswordScreen
 *
 * Presents a simple form for users to request a password reset email.  The
 * original implementation had broken destructuring in its props and used
 * an incorrect import path for the API helper.  This version cleans up
 * those issues and uses theme variables for consistent styling.
 */
const ForgotPasswordScreen = ({ navigation }) => {
  const { notify } = useNotification();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      notify({ title: 'Enter Email', message: 'Please enter your registered email address.' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await sendPasswordReset(email);
      if (result?.success) {
        notify({ title: 'Check your inbox', message: 'A password reset link has been sent.' });
        navigation.goBack();
      } else {
        notify({ title: 'Error', message: result?.message || 'Could not send reset link.' });
      }
    } catch (err) {
      notify({ title: 'Error', message: err.message || 'Failed to send reset email.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Forgot Password</Text>
      <Text style={styles.instructions}>Enter your email address to receive a password reset link.</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Email address"
        placeholderTextColor={COLORS.grey}
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.7 }]}
        onPress={handleReset}
        disabled={isLoading}
      >
        {isLoading
          ? <ActivityIndicator color={COLORS.white} />
          : <Text style={styles.buttonText}>Send Reset Link</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: FONTS.size.title,
    fontFamily: FONTS.bold,
    marginBottom: 20,
    color: COLORS.burntOrange,
  },
  instructions: {
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  input: {
    width: '90%',
    borderWidth: BORDERS.width,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDERS.radius,
    padding: 14,
    fontSize: FONTS.size.input,
    marginVertical: 18,
    backgroundColor: COLORS.inputBg,
    color: COLORS.black,
  },
  button: {
    width: '90%',
    backgroundColor: COLORS.burntOrange,
    paddingVertical: 16,
    borderRadius: BORDERS.radius,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONTS.size.button,
  },
});

export default ForgotPasswordScreen;
