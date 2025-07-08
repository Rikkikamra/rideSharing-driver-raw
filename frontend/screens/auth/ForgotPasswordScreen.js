import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { sendPasswordReset } from '../../utils/api';

const ForgotPasswordScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your registered email address.');
      return;
    }
    setLoading(true);
    const result = await sendPasswordReset(email);
    setLoading(false);
    if (result?.success) {
      Alert.alert('Check your email', 'A password reset link has been sent.');
      navigation.goBack();
    } else {
      Alert.alert('Error', result?.message || 'Could not send reset link.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Forgot Password</Text>
      <Text style={{ color: colors.text, marginBottom: 10 }}>
        Enter your email address to receive a password reset link.
      </Text>
      <TextInput
        style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Email address"
        placeholderTextColor={colors.text + '77'}
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
        onPress={handleReset}
        disabled={loading}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '80%',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    marginVertical: 18,
  },
  btn: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
});

export default ForgotPasswordScreen;
