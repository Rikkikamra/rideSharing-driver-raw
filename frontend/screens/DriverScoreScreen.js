
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fetchDriverScore } from '../utils/api';

const DriverScoreScreen = () => {
  const { colors } = useTheme();
  const [score, setScore] = useState(null);

  useEffect(() => {
    const getScore = async () => {
      const result = await fetchDriverScore();
      if (result) setScore(result);
    };
    getScore();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Driver Score</Text>
      {score ? (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.text }]}>Overall Rating:</Text>
          <Text style={[styles.score, { color: colors.primary }]}>{score.rating.toFixed(2)} / 5</Text>
          <Text style={[styles.label, { color: colors.text }]}>Completed Rides: {score.completedRides}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Positive Feedback: {score.positiveFeedback}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Reports: {score.reports}</Text>
        </View>
      ) : (
        <Text style={[styles.placeholder, { color: colors.text }]}>Loading score details...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholder: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
  },
});

export default DriverScoreScreen;
