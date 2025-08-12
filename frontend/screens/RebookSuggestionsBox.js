import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import apiClient from '../utils/api';                  // ← unified HTTP client
import { AuthContext } from '../context/AuthProvider';
import { useNotification } from '../context/NotificationContext';

const RebookSuggestionsBox = ({ onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const { notify } = useNotification();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await apiClient.get('/rebook/suggestions'); // ← no manual headers/URL
        if (data?.success) {
          setSuggestions(data.suggestions || []);
        } else {
          setError('Could not fetch suggestions. Please try again later.');
          notify('Error', 'Could not fetch suggestions. Please try again later.');
        }
      } catch {
        setError('Failed to fetch rebook suggestions. Please try again later.');
        notify('Error', 'Failed to fetch rebook suggestions. Please try again later.');
      }
    };

    if (user) fetchSuggestions(); // token handled by interceptor
  }, [user, notify]);

  const formatTime = (hour) => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${suffix}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rebook a Previous Ride</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={suggestions}
        keyExtractor={(item) => (item.id ? String(item.id) : `${item.from}-${item.to}`)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
            <Text style={styles.route}>{item.from} → {item.to}</Text>
            <Text style={styles.meta}>Suggested Time: {formatTime(item.suggestedHour)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!error && <Text style={styles.empty}>No suggestions available right now.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 12, paddingHorizontal: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  card: { backgroundColor: '#FFF3E0', padding: 12, borderRadius: 10, marginBottom: 10 },
  route: { fontSize: 15, fontWeight: '600', color: '#D84315' },
  meta: { fontSize: 13, color: '#555' },
  error: { color: '#D7263D', marginBottom: 10, textAlign: 'center' },
  empty: { color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
});

export default RebookSuggestionsBox;
