import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../theme/ThemeContext';

const LocationCheckScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      let { status: permStatus } = await Location.requestForegroundPermissionsAsync();
      if (permStatus !== 'granted') {
        setStatus('denied');
        setMessage('Location permission denied. Please enable location to continue.');
      } else {
        let location = await Location.getCurrentPositionAsync({});
        if (location) {
          setStatus('granted');
          setTimeout(() => navigation.replace('Let's Drive'), 1200);
        } else {
          setStatus('error');
          setMessage('Unable to retrieve location. Please try again.');
        }
      }
    })();
  }, []);

  if (status === 'checking') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 18 }}>Checking location permission...</Text>
      </View>
    );
  }

  if (status === 'denied') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
          Location Required
        </Text>
        <Text style={{ color: colors.text, marginBottom: 20 }}>{message}</Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={() => Linking.openSettings()}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.danger, marginBottom: 12 }}>{message}</Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.replace('Let's Drive')}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>Redirecting...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  btn: { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 22, elevation: 2 },
});

export default LocationCheckScreen;
