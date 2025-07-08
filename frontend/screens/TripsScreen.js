
import React
import ProtectedRoute from '../components/ProtectedRoute';, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const TripsScreen = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    axios.get('https://api.swiftcampus.com/api/trips')
      .then(response => setTrips(response.data))
      .catch(error => console.error('Failed to fetch trips:', error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Trips</Text>
      <FlatList
        data={trips}
        keyExtractor={(item, index) => index.toString()}
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
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  tripCard: {
    backgroundColor: '#fff5eb',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#ff6600',
    borderWidth: 1,
  },
  route: { fontSize: 16, fontWeight: '500' },
  date: { color: '#666', marginTop: 4 },
});

const WrappedTripsScreen = () => (
  <ProtectedRoute>
    <TripsScreen />
  </ProtectedRoute>
);

export default WrappedTripsScreen;
