
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const RebookSuggestionsBox = ({ onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('https://api.swiftcampus.com/rebook/suggestions', {
          headers: { 'x-user-id': 'user123' }
        });
        if (response.data.success) {
          setSuggestions(response.data.suggestions);
        }
      } catch (err) {
        console.error('Failed to fetch rebook suggestions');
      }
    };

    fetchSuggestions();
  }, []);

  const formatTime = hour => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${suffix}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rebook a Previous Ride</Text>
      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.route}>{item.from} → {item.to}</Text>
            <Text style={styles.meta}>Suggested Time: {formatTime(item.suggestedHour)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 12, paddingHorizontal: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  route: { fontSize: 15, fontWeight: '600', color: '#D84315' },
  meta: { fontSize: 13, color: '#555' },
});

export default RebookSuggestionsBox;
