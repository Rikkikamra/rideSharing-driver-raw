
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

const QuietPreferenceSettings = () => {
  const { theme } = useContext(ThemeContext);
  const [isQuiet, setIsQuiet] = useState(false);

  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      const storedValue = await AsyncStorage.getItem('quietPreference');
      if (storedValue !== null) {
        setIsQuiet(storedValue === 'true');
      }
    } catch (error) {
      console.error('Error loading preference', error);
    }
  };

  const toggleQuietMode = async (value) => {
    try {
      setIsQuiet(value);
      await AsyncStorage.setItem('quietPreference', value.toString());
      Alert.alert('Preference Saved', value ? 'Quiet Mode Enabled' : 'Quiet Mode Disabled');
    } catch (error) {
      console.error('Failed to save preference', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Quiet Ride Preference</Text>
      <Text style={[styles.description, { color: theme.muted }]}>
        Enable this option if you prefer a quiet ride with minimal conversation. Drivers will be notified of your preference.
      </Text>

      <View style={styles.switchRow}>
        <Text style={[styles.label, { color: theme.text }]}>Enable Quiet Mode</Text>
        <Switch
          value={isQuiet}
          onValueChange={toggleQuietMode}
          trackColor={{ false: theme.muted, true: theme.accent }}
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
