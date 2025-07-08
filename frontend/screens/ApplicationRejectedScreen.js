
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ApplicationRejectedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Application Rejected</Text>
      <Text style={styles.subtitle}>
        Unfortunately, your application was not approved. You may review and resubmit your details for consideration.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('DriverOnboardingScreen')}
      >
        <Text style={styles.buttonText}>Resubmit Application</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#E4572E', marginBottom: 16 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 24 },
  button: { backgroundColor: '#E4572E', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
