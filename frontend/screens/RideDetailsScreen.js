// frontend/screens/RideDetailsScreen.js

import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthProvider';
import apiClient from '../utils/api';

/**
 * RideDetailsScreen
 *
 * Displays a summary of a selected ride and allows the driver to confirm
 * acceptance.  The original implementation contained invalid syntax and
 * referenced a non‑existent AuthContext path and hard‑coded backend URL.
 * This version uses the configured apiClient and cleans up the component
 * declaration.
 */
const RideDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { notify } = useNotification();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { ride } = route.params;

  const confirmRide = async () => {
    setLoading(true);
    try {
      const payload = {
        rideId: ride._id,
        vehicleId: user.defaultVehicleId,
        acceptedReturn: Boolean(ride.hasReturnOption),
      };
      await apiClient.post('/bookings/driver-confirm', payload);
      notify({ title: 'Success', message: 'Ride confirmed!' });
      navigation.navigate('MyTripsScreen');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Something went wrong';
      notify({ title: 'Error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Summary</Text>
      <Text style={styles.label}>From: <Text style={styles.value}>{ride.from}</Text></Text>
      <Text style={styles.label}>To: <Text style={styles.value}>{ride.to}</Text></Text>
      <Text style={styles.label}>Date: <Text style={styles.value}>{new Date(ride.date).toLocaleString()}</Text></Text>

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={confirmRide} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirm Ride</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 20, color: '#bf5700', textAlign: 'center', fontWeight: 'bold' },
  label: { fontSize: 16, marginBottom: 6, color: '#333' },
  value: { fontWeight: '600' },
  button: {
    backgroundColor: '#bf5700',
    padding: 16,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default RideDetailsScreen;
