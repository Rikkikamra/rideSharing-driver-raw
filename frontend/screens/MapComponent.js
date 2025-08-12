import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
// import { useTheme } from '@react-navigation/native'; // Uncomment if using theming

const MapComponent = ({ fromLocation, toLocation, routeCoordinates }) => {
  const mapRef = useRef(null);
  // const theme = useTheme(); // Uncomment if using theming

  useEffect(() => {
    if (fromLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: fromLocation.latitude,
        longitude: fromLocation.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }, 500);
    }
  }, [fromLocation]);

  if (!fromLocation || !toLocation) {
    // Optional: loading indicator if data not ready
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E4572E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: fromLocation.latitude,
          longitude: fromLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={fromLocation} title="Pickup" description="Pickup location" />
        <Marker coordinate={toLocation} title="Dropoff" description="Dropoff location" />
        {routeCoordinates && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#E4572E" // or theme.colors.primary
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};

// Add PropTypes if desired (optional)

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height * 0.4,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
