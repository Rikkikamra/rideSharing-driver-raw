
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const RideTypeSelectionScreen = ({ route, navigation }) => {
  const { fromLat, fromLng, toLat, toLng } = route.params;
  const [fare, setFare] = useState(null);
  const [surgeInfo, setSurgeInfo] = useState(null);

  useEffect(() => {
    axios.post('https://api.swiftcampus.com/api/pricing', {
      fromLat,
      fromLng,
      toLat,
      toLng
    }).then(res => {
      setFare(res.data.fare);
      setSurgeInfo(res.data.surge ? res.data : null);
    });
  }, []);

  if (!fare) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      {surgeInfo && (
        <Text style={styles.surge}>🔥 Surge Pricing Active in {surgeInfo.zone} (×{surgeInfo.surgeFactor})</Text>
      )}
      <Text style={styles.fare}>Estimated Fare: ${fare}</Text>
      <Button title="Continue to Book" onPress={() => navigation.navigate('RideSummaryScreen', {
        fromLat, fromLng, toLat, toLng, fare
      })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  surge: { color: 'red', textAlign: 'center', marginBottom: 10 },
  fare: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }
});

export default RideTypeSelectionScreen;
