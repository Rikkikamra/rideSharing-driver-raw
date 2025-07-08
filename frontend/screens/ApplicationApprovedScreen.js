
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function ApplicationApprovedScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('AddVehicleDetailsScreen');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Congratulations!</Text>
      <Text style={styles.subtitle}>Your application has been approved. Let’s get your vehicle details next.</Text>
      <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} fadeOut />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#E4572E', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#333' },
});
