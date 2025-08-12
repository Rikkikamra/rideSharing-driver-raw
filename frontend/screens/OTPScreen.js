// frontend/screens/OTPScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNotification } from '../context/NotificationContext';
import { verifyTwoFACode } from '../utils/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const OTPScreen = () => {
  const { notify } = useNotification();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { email, phone } = useRoute().params;

const handleVerifyOtp = async () => {
  if (!otp) {
    return notify('Please enter the OTP');
  }
  setLoading(true);
  try {
    // Our verifyTwoFACode helper expects a user identifier and the code separately.
    // Use either the email or phone from the route params to identify the user.
    const userId = phone || email;
    const { success, message } = await verifyTwoFACode(userId, otp);
    if (success) {
      navigation.replace('DriverOnboardingScreen');
    } else {
      notify('Invalid OTP', message);
    }
  } catch (err) {
    console.error(err);
    notify('Verification failed', err.message || 'Please try again');
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={{ padding: 20 }}>
      <Text>Enter OTP sent to your {email || phone}</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        placeholder="Enter OTP"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button
        title={loading ? 'Verifying...' : 'Verify OTP'}
        onPress={handleVerifyOtp}
        disabled={loading}
      />
    </View>
  );
};

export default OTPScreen;
