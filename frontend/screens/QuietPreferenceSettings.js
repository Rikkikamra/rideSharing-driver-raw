import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useNotification } from '../context/NotificationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api'; // Make sure your Axios instance is here

const QuietPreferenceSettings = () => {
  const { notify } = useNotification();
  const { colors } = useTheme();
  const [isQuiet, setIsQuiet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      // Try loading from backend first
      const res = await api.get('/users/preferences');
      if (typeof res.data.quiet === 'boolean') {
        setIsQuiet(res.data.quiet);
        await AsyncStorage.setItem('quietPreference', res.data.quiet.toString());
      } else {
        // fallback to AsyncStorage
        const storedValue = await AsyncStorage.getItem('quietPreference');
        if (storedValue !== null) {
          setIsQuiet(storedValue === 'true');
        }
      }
    } catch (error) {
      // fallback to AsyncStorage if backend fails
      const storedValue = await AsyncStorage.getItem('quietPreference');
      if (storedValue !== null) {
        setIsQuiet(storedValue === 'true');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleQuietMode = async (value) => {
    try {
      setIsQuiet(value);
      await AsyncStorage.setItem('quietPreference', value.toString());
      await api.post('/users/preferences', { quiet: value });
      notify('Preference Saved', value ? 'Quiet Mode Enabled' : 'Quiet Mode Disabled');
    } catch (error) {
      notify('Failed to save preference', 'Please try again.');
      console.error('Failed to save preference', error);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text style={{ color: colors.text, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.header, { color: colors.text }]}>Quiet Ride Preference</Text>
      <Text style={[styles.description, { color: colors.muted }]}> 
        Enable this option if you prefer a quiet ride with minimal conversation. Drivers will be notified of your preference.
      </Text>

      <View style={styles.switchRow}> 
        <Text style={[styles.label, { color: colors.text }]}>Enable Quiet Mode</Text>
        <Switch
          value={isQuiet}
          onValueChange={toggleQuietMode}
          trackColor={{ false: colors.muted, true: colors.accent }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
});

export default QuietPreferenceSettings;
