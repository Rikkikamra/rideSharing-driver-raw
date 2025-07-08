
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const OTPScreen = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { email, phone } = route.params;

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('https://api.swiftcampus.com/api/2fa/verify-otp', {
        email,
        phone,
        otp,
      });

      if (res.data.success) {
        navigation.replace('DriverOnboardingScreen');
      } else {
        Alert.alert('Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Verification failed', err?.response?.data?.message || 'Please try again');
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
      <Button title={loading ? "Verifying..." : "Verify OTP"} onPress={handleVerifyOtp} disabled={loading} />
    </View>
  );
};

export default OTPScreen;
