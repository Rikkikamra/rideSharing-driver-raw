import React, { useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

export default function BiometricAuth({ onSuccess, onFailure }) {
  const [loading, setLoading] = useState(false);

  const handleBiometric = async () => {
    setLoading(true);
    const rnBiometrics = new ReactNativeBiometrics();

    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      if (!available) {
        Alert.alert('Biometrics Not Available', 'No biometric sensors found on this device.');
        onFailure && onFailure();
        setLoading(false);
        return;
      }
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate with biometrics',
      });
      if (success) {
        onSuccess && onSuccess();
      } else {
        Alert.alert('Authentication Failed', 'Biometric authentication was not successful.');
        onFailure && onFailure();
      }
    } catch (e) {
      Alert.alert('Error', 'An error occurred during biometric authentication.');
      onFailure && onFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ alignItems: 'center', marginVertical: 16 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Sign in with Biometrics</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Authenticate" onPress={handleBiometric} />
      )}
    </View>
  );
}