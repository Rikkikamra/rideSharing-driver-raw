import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ReturnTripPrompt({ onAccept, onDismiss }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Want to book a return trip and save 10%?</Text>
      <Button title="Yes, Book Return" onPress={onAccept} />
      <Button title="No Thanks" onPress={onDismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  text: { fontSize: 16, marginBottom: 10 }
});
