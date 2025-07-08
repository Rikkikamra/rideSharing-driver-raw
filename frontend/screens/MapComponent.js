import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const MapComponent = ({ fromLocation, toLocation, routeCoordinates }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: fromLocation?.latitude || 30.2672,
          longitude: fromLocation?.longitude || -97.7431,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {fromLocation && <Marker coordinate={fromLocation} title="Pickup" />}
        {toLocation && <Marker coordinate={toLocation} title="Dropoff" />}
        {routeCoordinates && <Polyline coordinates={routeCoordinates} strokeColor="#ff6600" strokeWidth={4} />}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height * 0.4,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;