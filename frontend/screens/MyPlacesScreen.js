import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// Notification context not used here since deletion confirmation uses Alert.
import { useTheme } from '../context/ThemeContext';
// Import the SavedPlacesContext so we can access persisted places
import { useSavedPlaces } from '../context/SavedPlacesContext';
import { Ionicons } from '@expo/vector-icons';

export default function MyPlacesScreen({ navigation }) {
  const { colors } = useTheme();
  // Pull places and actions from context.  The context persists
  // places in AsyncStorage and provides add/remove helpers.
  const { savedPlaces, removePlace } = useSavedPlaces();
  const [places, setPlaces] = useState([]);

  // Synchronise local state with context whenever the underlying
  // savedPlaces array changes.  This avoids stale values when
  // places are added or removed.
  useEffect(() => {
    setPlaces(savedPlaces);
  }, [savedPlaces]);

  // Ask for confirmation before removing a saved place.  We use
  // the place's label as the identifier, consistent with the
  // SavedPlacesContext API.  Once the user confirms, remove the
  // place and the context will propagate the change back.
  const handleDelete = async (label) => {
    // Use the built‑in Alert API instead of notify() for confirmation.
    Alert.alert(
      'Delete Place',
      'Are you sure you want to delete this place?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removePlace(label);
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>My Saved Places</Text>
      <FlatList
        data={places}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View>
              <Text style={[styles.placeName, { color: colors.text }]}>{item.label}</Text>
              <Text style={{ color: colors.text }}>{item.address}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.label)} style={styles.deleteBtn}>
              <Ionicons name="trash" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 30 }}>
            No saved places yet.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      {/* Removed Add Place button because an AddPlace screen is not implemented. */}
    </View>
  );
}

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
    justifyContent: 'space-between',
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
