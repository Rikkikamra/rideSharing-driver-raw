
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const FareEstimateBox = ({ from, to, riderType = 'regular', quietMode = false }) => {
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surge, setSurge] = useState(false);

  useEffect(() => {
    const fetchFare = async () => {
      setLoading(true);
      try {
        const response = await axios.post('https://api.swiftcampus.com/fare/estimate', {
          from,
          to,
          riderType,
          quietMode
        });

        if (response.data.success) {
          setFare(response.data.estimatedFare);
          setSurge(response.data.surge);
        }
      } catch (err) {
        setFare(null);
      } finally {
        setLoading(false);
      }
    };

    if (from && to) {
      fetchFare();
    }
  }, [from, to, riderType, quietMode]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#D84315" />
        <Text style={styles.label}>Calculating fare...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {fare !== null ? (
        <>
          <Text style={styles.fare}>Estimated Fare: ${fare.toFixed(2)}</Text>
          {surge && <Text style={styles.surge}>Surge Pricing Active</Text>}
        </>
      ) : (
        <Text style={styles.error}>Unable to estimate fare. Try again.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 14, borderRadius: 10, backgroundColor: '#f9f9f9', marginVertical: 10 },
  label: { textAlign: 'center', color: '#666' },
  fare: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  surge: { color: 'red', textAlign: 'center', marginTop: 4 },
  error: { color: 'darkred', textAlign: 'center' },
});

export default FareEstimateBox;
