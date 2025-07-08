
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fetchVehiclesAPI } from '../utils/api';

const MyVehicleScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await fetchVehiclesAPI();
        setVehicles(data);
      } catch (err) {
        console.error('Error loading vehicles:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>My Vehicles</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        vehicles.map((v, idx) => (
          <View key={idx} style={styles.vehicleCard}>
            <Text style={[styles.vehicleText, { color: colors.text }]}>{v.year} {v.make} {v.model}</Text>
            <Text style={{ color: colors.text }}>Plate: {v.licensePlate}</Text>
            <Text style={{ color: colors.text, fontStyle: 'italic' }}>
              Status: {v.status || 'Pending Review'}
            </Text>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddVehicleDetails')}
      >
        <Text style={styles.addButtonText}>+ Add Another Vehicle</Text>
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
