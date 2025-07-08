
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const DriverResourcesScreen = () => {
  const { colors } = useTheme();

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Driver Resources</Text>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => openLink('https://swiftcampus.com/driver-guide')}
      >
        <Text style={[styles.title, { color: colors.text }]}>Driver Handbook</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          Learn the best practices and rules for driving with SwiftCampus.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => openLink('https://swiftcampus.com/vehicle-maintenance')}
      >
        <Text style={[styles.title, { color: colors.text }]}>Vehicle Maintenance Tips</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          Keep your car in top shape and avoid common issues.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => openLink('https://swiftcampus.com/safety-tips')}
      >
        <Text style={[styles.title, { color: colors.text }]}>Safety Guidelines</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          Tips for staying safe on the road and handling emergencies.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 18,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
  },
});

export default DriverResourcesScreen;
