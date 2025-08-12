import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
// Import from the correct relative path.  This file is in `frontend/screens`
// so `../utils/api` resolves to `frontend/utils/api`.
import { fetchDriverEarnings } from '../utils/api';

const EarningsScreen = () => {
  const { colors } = useTheme();
  const [earnings, setEarnings] = useState({ day: 0, week: 0, month: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadEarnings = async () => {
    setRefreshing(true);
    const data = await fetchDriverEarnings();
    if (data) setEarnings(data);
    setRefreshing(false);
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={loadEarnings}
          tintColor={colors.primary}
        />
      }
    >
      <Text style={[styles.header, { color: colors.primary }]}>Your Earnings</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>Today</Text>
        <Text style={[styles.amount, { color: colors.primary }]}>
          ${earnings.day.toFixed(2)}
        </Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>This Week</Text>
        <Text style={[styles.amount, { color: colors.primary }]}>
          ${earnings.week.toFixed(2)}
        </Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>This Month</Text>
        <Text style={[styles.amount, { color: colors.primary }]}>
          ${earnings.month.toFixed(2)}
        </Text>
      </View>
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
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default EarningsScreen;
