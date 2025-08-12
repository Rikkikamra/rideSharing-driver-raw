import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapComponent from '../components/MapComponent';
import { fetchRoute } from '../utils/mapsAPI';

const TripDetailsScreen = ({ route }) => {
  const { trip } = route.params;
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRoute() {
      try {
        setLoading(true);
        const data = await fetchRoute(trip.from, trip.to);
        setFromLocation(data.fromLocation);
        setToLocation(data.toLocation);
        setRouteCoordinates(data.routeCoordinates);
      } catch (err) {
        Alert.alert('Error', err?.response?.data?.error || 'Could not fetch route.');
      } finally {
        setLoading(false);
      }
    }
    getRoute();
  }, [trip]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>From: {trip.from}</Text>
      <Text style={styles.label}>To: {trip.to}</Text>
      <Text style={styles.label}>Date: {trip.date}</Text>

      <View style={styles.mapContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#E4572E" />
        ) : (
          <MapComponent
            fromLocation={fromLocation}
            toLocation={toLocation}
            routeCoordinates={routeCoordinates}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  mapContainer: { marginTop: 20, height: 300 }
});

export default TripDetailsScreen;
