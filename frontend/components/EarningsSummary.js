import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * A simple summary card component that displays the driver’s earnings for
 * today, this week and this month.  This component expects an
 * `earnings` prop containing numeric values for `day`, `week` and `month`.
 */
export default function EarningsSummary({ earnings }) {
  const { colors } = useTheme();
  const entries = [
    { label: 'Today', value: earnings?.day ?? 0 },
    { label: 'This Week', value: earnings?.week ?? 0 },
    { label: 'This Month', value: earnings?.month ?? 0 },
  ];
  return (
    <View style={styles.container}>
      {entries.map((entry) => (
        <View key={entry.label} style={[styles.card, { backgroundColor: colors.card }]}> 
          <Text style={[styles.label, { color: colors.text }]}>{entry.label}</Text>
          <Text style={[styles.amount, { color: colors.primary }]}>${entry.value.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
