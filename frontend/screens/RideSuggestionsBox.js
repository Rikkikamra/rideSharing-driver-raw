
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const RideSuggestionsBox = ({ onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('https://api.swiftcampus.com/suggestions', {
          headers: {
            'x-user-id': 'user123',
            'x-user-role': 'student',
            'x-user-city': 'Austin'
          }
        });
        if (response.data.success) {
          setSuggestions(response.data.suggestions);
        }
      } catch (err) {
        console.error('Failed to load suggestions');
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
