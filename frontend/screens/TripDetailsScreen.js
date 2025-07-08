
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapComponent from '../components/MapComponent';

const TripDetailsScreen = ({ route }) => {
  const { trip } = route.params;
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);

  useEffect(() => {
        const geocodeLocation = async (address) => {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_GOOGLE_MAPS_API_KEY`);
        const data = await response.json();
        if (data.results?.length > 0) {
          const loc = data.results[0].geometry.location;
          return { latitude: loc.lat, longitude: loc.lng };
        }
      } catch (err) {
        console.error('Geocoding error:', err);
      }
      return null;
    };

    const fetchLocations = async () => {
      setFromLocation(await geocodeLocation(trip.from));
      setToLocation(await geocodeLocation(trip.to));
    };

    fetchLocations();
  }, [trip]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>From: {trip.from}</Text>
      <Text style={styles.label}>To: {trip.to}</Text>
      <Text style={styles.label}>Date: {trip.date}</Text>

      <View style={styles.mapContainer}>
        <MapComponent fromLocation={fromLocation} toLocation={toLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  mapContainer: { marginTop: 20 }
});

export default TripDetailsScreen;
