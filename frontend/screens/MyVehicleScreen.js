// File: frontend/screens/MyVehicleScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { fetchVehiclesAPI } from '../utils/vehicleAPI';
import { useNotification } from '../context/NotificationContext';

const MyVehicleScreen = ({ navigation }) => {
  // Pull colors from the navigation theme rather than a custom theme context.
  // This ensures the screen respects dark/light mode and any theming overrides.
  const { colors } = useTheme();
  const { notify } = useNotification();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Shared loader, used for both initial and pull‑to‑refresh loads
  const loadVehicles = useCallback(async () => {
    try {
      const data = await fetchVehiclesAPI();
      setVehicles(data);
    } catch (err) {
      console.error('Error loading vehicles:', err);
      notify('Error', 'Unable to load vehicles. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [notify]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const onRefresh = () => {
    setRefreshing(true);
    loadVehicles();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      <Text style={[styles.header, { color: colors.text }]}>My Vehicles</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : vehicles.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text }]}>
          You have no vehicles added yet.
        </Text>
      ) : (
        vehicles.map((v) => (
          <View
            key={v._id}
            style={[styles.vehicleCard, { backgroundColor: colors.card }]}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`${v.year} ${v.make} ${v.model}, plate ${v.licensePlate}. Status ${v.status || 'Pending Review'}`}
          >
            <Text style={[styles.vehicleText, { color: colors.text }]}>
              {v.year} {v.make} {v.model}
            </Text>
            <Text style={{ color: colors.text }}>Plate: {v.licensePlate}</Text>
            <Text style={{ color: colors.text, fontStyle: 'italic' }}>
              Status: {v.status || 'Pending Review'}
            </Text>
          </View>
        ))
      )}

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Add another vehicle"
        accessibilityHint="Opens the form to add a new vehicle"
        onPress={() => navigation.navigate('AddVehicleDetails')}
      >
        <Text style={[styles.addButtonText, { color: colors.background }]}>+ Add Another Vehicle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  vehicleCard: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#333',
    marginBottom: 12,
  },
  vehicleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#bb5500',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyVehicleScreen;
