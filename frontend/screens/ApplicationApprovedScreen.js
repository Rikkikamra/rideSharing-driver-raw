import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../context/NotificationContext';

export default function ApplicationApprovedScreen() {
  const navigation = useNavigation();
  const { notify } = useNotification();

  useEffect(() => {
    notify('Congratulations 🎉', 'Your driver application is approved.');
  }, [notify]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Congratulations!</Text>
      <Text style={styles.subtitle}>
        Your driver application has been approved. You can now start accepting rides.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 24, backgroundColor: '#fff'
  },
  title: {
    fontSize: 24, fontWeight: 'bold', color: '#E4572E', marginBottom: 12
  },
  subtitle: {
    fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 24
  },
  button: {
    backgroundColor: '#E4572E', paddingVertical: 12,
    paddingHorizontal: 24, borderRadius: 8
  },
  buttonText: {
    color: '#fff', fontSize: 16, fontWeight: '600'
  }
});
