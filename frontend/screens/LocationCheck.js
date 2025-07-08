
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';

const LocationCheck = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to book rides.');
          navigation.goBack();
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        if (
          Platform.OS === 'android' &&
          location.mocked
        ) {
          Alert.alert('Fake GPS Detected', 'Please disable mock location to continue.');
          navigation.goBack();
          return;
        }

        navigation.replace('Let's Drive', { latitude, longitude });
      } catch (err) {
        Alert.alert('Location Error', 'Unable to determine your location.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    checkLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Checking location services...</Text>
      <ActivityIndicator size="large" color="#D84315" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  text: { fontSize: 16, marginBottom: 20 },
});

export default LocationCheck;
