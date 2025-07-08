import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const rideTypes = [
  { id: '1', name: 'Standard', description: 'Affordable shared ride', icon: '🚗' },
  { id: '2', name: 'Private', description: 'Non-stop personal ride', icon: '🚘' },
  { id: '3', name: 'Quiet Ride', description: 'Low-noise travel', icon: '🤫' },
];

const RideTypeSelection = ({ onSelect }) => {
  return (
    <FlatList
      data={rideTypes}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
          <Text style={styles.icon}>{item.icon}</Text>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff5eb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffa726',
  },
  icon: { fontSize: 30, marginRight: 14 },
  name: { fontSize: 18, fontWeight: '600' },
  description: { fontSize: 14, color: '#555' },
});

export default RideTypeSelection;