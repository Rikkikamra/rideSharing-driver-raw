import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const SplashScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#ff6600" />
    <Text style={styles.text}>Loading SwiftCampus Driver App...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
  },
  text: {
    marginTop: 20, fontSize: 16, color: '#333'
  }
});

export default SplashScreen;