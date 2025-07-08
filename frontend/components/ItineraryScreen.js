
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ItineraryScreen = ({ from, to, date, fare }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trip Itinerary</Text>
      <Text>From: {from}</Text>
      <Text>To: {to}</Text>
      <Text>Date: {date}</Text>
      <Text>Estimated Fare: ${fare}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
});

export default ItineraryScreen;
