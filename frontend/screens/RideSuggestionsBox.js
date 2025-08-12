
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
// Use the configured API client rather than raw axios.  This ensures
// tokens are attached and the base URL is respected.
import apiClient from '../utils/api';

const RideSuggestionsBox = ({ onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // The `/rebook/suggestions` endpoint returns the five most recent
        // rides for the authenticated user.  This replaces the old
        // `/suggestions` call which had no server implementation.
        const { data } = await apiClient.get('/rebook/suggestions');
        if (data && data.success) {
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error('Failed to load ride suggestions', err);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Rides</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chip}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.chipText}>{item.from} → {item.to}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  chip: {
    backgroundColor: '#FFCCBC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10
  },
  chipText: { color: '#D84315', fontWeight: '600' }
});

export default RideSuggestionsBox;
