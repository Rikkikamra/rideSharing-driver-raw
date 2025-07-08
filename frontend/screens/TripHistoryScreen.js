
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthProvider';

const API_BASE_URL = '/api';

export default function TripHistoryScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/trips/history`, { headers: { 'x-user-id': user?._id } });
        setTrips(res.data.trips || []);
      } catch {
        setError('Could not load trip history.');
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) fetchHistory();
  }, [user]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colors.primary} />;
  if (error) return <View style={styles.center}><Text style={{ color: '#c00' }}>{error}</Text></View>;
  if (!trips.length) return <View style={styles.center}><Text style={{ color: colors.text, marginTop: 20 }}>No past trips found.</Text></View>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Trip History</Text>
      <FlatList
        data={trips}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('TripDetailsScreen', { trip: item })}
            style={[styles.tripCard, { backgroundColor: colors.card, borderColor: colors.primary }]}
          >
            <Text style={[styles.route, { color: colors.text }]}>{item.from} ➝ {item.to}</Text>
            <Text style={[styles.date, { color: colors.text }]}>{new Date(item.date).toLocaleDateString()} {item.time}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 14 },
  tripCard: { padding: 15, borderRadius: 12, marginBottom: 13, borderWidth: 1.5, elevation: 1 },
  route: { fontSize: 17, fontWeight: 'bold', marginBottom: 3 },
  date: { color: '#775222', marginBottom: 4 },
  price: { color: '#b15518', fontWeight: 'bold', marginTop: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
