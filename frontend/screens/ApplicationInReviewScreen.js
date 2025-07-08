
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function ApplicationInReviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Application Under Review</Text>
      <Text style={styles.subtitle}>
        Our team is reviewing your onboarding application. This usually takes 24–48 hours. You will be notified once a decision is made.
      </Text>
      <ActivityIndicator size="large" color="#E4572E" style={{ marginTop: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#E4572E', marginBottom: 16 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#333' },
});
