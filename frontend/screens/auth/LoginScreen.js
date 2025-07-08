import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { COLORS, FONTS, BORDERS } from '../theme';

const LoginScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Login logic here
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <Text style={styles.label}>Email or Phone</Text>
      <TextInput
        style={styles.input}
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        placeholder="Enter your email or phone"
        placeholderTextColor={COLORS.grey}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={COLORS.grey}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
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
};

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
    color: COLORS.burntOrange,
    textAlign: 'center',
    marginBottom: 36,
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

export default LoginScreen;
