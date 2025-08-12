// frontend/screens/TripsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import ProtectedRoute from '../components/ProtectedRoute';
import apiClient from '../utils/api';

/**
 * TripsScreen
 *
 * Displays a list of the driver’s trips.  The original file mixed the import
 * of ProtectedRoute with hook imports and hard‑coded the API endpoint,
 * leading to syntax errors and environment coupling.  This version uses
 * the configured apiClient (which automatically attaches the auth token
 * and base URL) and cleans up the imports.
 */
const TripsScreen = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTrips = async () => {
      try {
        const { data } = await apiClient.get('/trips');
        if (isMounted) setTrips(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch trips.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTrips();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#bf5700" />
        <Text style={styles.loadingText}>Loading trips...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Trips</Text>
      <FlatList
        data={trips}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tripCard}>
            <Text style={styles.route}>{item.from} ➝ {item.to}</Text>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#bf5700' },
  tripCard: {
    backgroundColor: '#fff5eb',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#bf5700',
    borderWidth: 1,
  },
  route: { fontSize: 16, fontWeight: '500' },
  date: { color: '#666', marginTop: 4 },
  loadingText: { marginTop: 12, color: '#666' },
  errorText: { color: '#d32f2f', textAlign: 'center' },
});

const WrappedTripsScreen = () => (
  <ProtectedRoute>
    <TripsScreen />
  </ProtectedRoute>
);

export default WrappedTripsScreen;
