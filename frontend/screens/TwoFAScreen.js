import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
// Import 2FA helpers from the shared API utility.  The previous
// relative path pointed outside the project hierarchy and caused
// module resolution errors.  This path assumes that
// TwoFAScreen.js resides in frontend/screens and utils/api.js lives
// one directory up in frontend/utils.
import { verifyTwoFACode, sendTwoFACode } from '../utils/api';

const TwoFAScreen = ({ navigation, route }) => {
  const { notify } = useNotification();
  const { colors } = useTheme();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const userId = route?.params?.userId;

  const handleVerify = async () => {
    if (!code.trim()) {
      notify('Error', 'Please enter the 2FA code.');
      return;
    }
    setLoading(true);
    const result = await verifyTwoFACode(userId, code);
    setLoading(false);
    if (result?.success) {
      navigation.replace("Let's Drive");
    } else {
      notify('Invalid Code', result?.message || 'Incorrect or expired code.');
      setCode('');
    }
  };

  const handleResend = async () => {
    setLoading(true);
    await sendTwoFACode(userId);
    setLoading(false);
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.primary }]}>Two-Factor Authentication</Text>
      <Text style={{ color: colors.text, marginBottom: 12 }}>
        Enter the 2FA code sent to your registered contact.
      </Text>
      <TextInput
        style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
        keyboardType="numeric"
        value={code}
        maxLength={6}
        onChangeText={setCode}
        placeholder="6-digit code"
        placeholderTextColor={colors.text + '77'}
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
          {loading ? 'Verifying...' : 'Verify'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 24 }} onPress={handleResend} disabled={loading || resent}>
        <Text style={{ color: colors.link, fontWeight: '500' }}>
          {resent ? 'Code resent!' : 'Resend code'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '80%',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    letterSpacing: 6,
    textAlign: 'center',
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

export default TwoFAScreen;
