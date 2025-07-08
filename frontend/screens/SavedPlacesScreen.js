
import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SavedPlacesContext } from '../context/SavedPlacesContext';

const SavedPlacesScreen = () => {
  const { places } = useContext(SavedPlacesContext);

  const renderPlace = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.address}>{item.address}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Saved Places</Text>
      {places.length === 0 ? (
        <Text style={styles.empty}>No saved places yet. Add some from the ride screen.</Text>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPlace}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#444',
  },
  empty: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default SavedPlacesScreen;
