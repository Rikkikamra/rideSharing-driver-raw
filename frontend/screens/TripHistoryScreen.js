import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../utils/api';
import { AuthContext } from '../context/AuthProvider';

const TripHistoryScreen = () => {
  const { colors } = useTheme();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      if (!user) throw new Error('No authenticated user');
      const riderId = user._id || user.id;
      const { data } = await apiClient.get(`/bookings/rider/${riderId}`);
      const bookings = Array.isArray(data) ? data : data.bookings || [];
      const mapped = bookings.map(b => {
        const ride = b.ride || {};
        return {
          id: b._id || ride._id || `${ride.from}-${ride.to}-${b.createdAt}`,
          date: ride.date || ride.createdAt || b.createdAt,
          from: ride.from,
          to: ride.to,
          price: ride.fare ?? b.fare,
          status: b.status || ride.status,
        };
      });
      setTrips(mapped);
    } catch (err) {
      console.error(err);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, padding: 16, backgroundColor: colors.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {trips.length === 0 ? (
        <Text style={{ color: colors.text, textAlign: 'center' }}>No trips found.</Text>
      ) : (
        trips.map(trip => (
          <View
            key={trip.id}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
              marginBottom: 12,
              elevation: 1,
            }}
          >
            <Text style={{ fontWeight: 'bold', color: colors.text }}>{String(trip.date)}</Text>
            <Text style={{ color: colors.text }}>
              {trip.from} → {trip.to}
            </Text>
            <Text style={{ color: colors.text }}>{trip.price}</Text>
            <Text
              style={{
                color: trip.status === 'Completed' ? colors.success : colors.error,
                fontWeight: '600',
              }}
            >
              {trip.status}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default TripHistoryScreen;
