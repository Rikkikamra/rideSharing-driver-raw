import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fetchSavedPlaces, removePlace } from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

const MyPlacesScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const loadPlaces = async () => {
      const saved = await fetchSavedPlaces();
      setPlaces(saved || []);
    };
    loadPlaces();
  }, []);

  const handleDelete = async (placeId) => {
    Alert.alert(
      'Delete Place',
      'Are you sure you want to delete this place?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          await removePlace(placeId);
          setPlaces(places.filter((p) => p._id !== placeId));
        }},
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>My Saved Places</Text>
      <FlatList
        data={places}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.placeName, { color: colors.text }]}>{item.name}</Text>
            <Text style={{ color: colors.text }}>{item.address}</Text>
            <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
              <Ionicons name="trash" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.text, textAlign: 'center', marginTop: 30 }}>No saved places yet.</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddPlace')}
      >
        <Ionicons name="add" size={28} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 4 }}>Add Place</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 12 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 14, marginLeft: 3 },
  card: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    justifyContent: 'space-between'
  },
  placeName: { fontWeight: '600', fontSize: 16, marginBottom: 3 },
  deleteBtn: { marginLeft: 10 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 24,
    bottom: 32,
    borderRadius: 32,
    paddingHorizontal: 18,
    paddingVertical: 10,
    elevation: 3,
  },
});

export default MyPlacesScreen;
