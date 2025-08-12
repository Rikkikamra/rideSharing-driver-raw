// frontend/screens/DriverScoreScreen.js

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import debounce from 'lodash.debounce';
import { useTheme } from '../context/ThemeContext';
import { fetchDriverScore } from '../utils/api';  // fixed import path

const DriverScoreScreen = () => {
  const { colors } = useTheme();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const loadScore = useCallback(async () => {
    setError(undefined);
    setLoading(true);
    try {
      const result = await fetchDriverScore();
      setScore(result);
    } catch (err) {
      console.error('DriverScore load error:', err);
      setError('Failed to load. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced loader for pull-to-refresh
  const debouncedLoad = useCallback(
    debounce(() => {
      loadScore();
    }, 1000, { leading: true, trailing: false }),
    [loadScore]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await debouncedLoad();
    setRefreshing(false);
  }, [debouncedLoad]);

  useEffect(() => {
    loadScore();
  }, [loadScore]);

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: colors.background }],
    [colors.background]
  );
  const cardStyle = useMemo(
    () => [styles.card, { backgroundColor: colors.card }],
    [colors.card]
  );

  // Initial loading state
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={containerStyle}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          testID="driverScore-loading"
        />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={containerStyle}>
        <Text
          style={[styles.errorText, { color: colors.error }]}
          accessibilityRole="alert"
          testID="driverScore-errorText"
        >
          {error}
        </Text>
        <TouchableOpacity
          onPress={loadScore}
          style={styles.retryButton}
          testID="driverScore-retryButton"
        >
          <Text
            style={[styles.retryText, { color: colors.primary }]}
            testID="driverScore-retryText"
          >
            Retry
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Main content
  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView
        style={containerStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            testID="driverScore-refreshControl"
          />
        }
      >
        <Text
          style={[styles.header, { color: colors.primary }]}
          accessibilityRole="header"
          accessibilityLabel={`Driver Score screen, overall rating ${
            score?.rating != null ? score.rating.toFixed(2) : 'N/A'
          } out of 5`}
          testID="driverScore-header"
        >
          Driver Score
        </Text>

        <View style={cardStyle}>
          <Text style={[styles.label, { color: colors.text }]}>
            Overall Rating:
          </Text>
          <Text
            style={[styles.score, { color: colors.primary }]}
            testID="driverScore-rating"
          >
            {score?.rating != null ? score.rating.toFixed(2) : '—'} / 5
          </Text>

          {score?.completedRides > 0 ? (
            <Text style={[styles.label, { color: colors.text }]}>
              Completed Rides: {score.completedRides}
            </Text>
          ) : (
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No rides completed yet
            </Text>
          )}

          <Text style={[styles.label, { color: colors.text }]}>
            Positive Feedback: {score?.positiveFeedback ?? 0}
          </Text>
          <Text style={[styles.label, { color: colors.text }]}>
            Reports: {score?.reports ?? 0}
          </Text>

          {/* Feedback Breakdown with empty-state */}
          <Text style={[styles.label, { color: colors.text, marginTop: 10 }]}>
            Feedback Breakdown:
          </Text>

          {((score?.positiveFeedback ?? 0) + (score?.reports ?? 0)) > 0 ? (
            <View
              style={[styles.barContainer, { borderColor: colors.border }]}
              accessible
              accessibilityRole="adjustable"
              accessibilityLabel={`Feedback: ${
                score.positiveFeedback
              } positive and ${score.reports} reports`}
              testID="driverScore-barContainer"
            >
              <View
                style={{
                  flex: score.positiveFeedback,
                  backgroundColor: colors.primary,
                }}
              />
              <View
                style={{
                  flex: score.reports,
                  backgroundColor: colors.error,
                }}
              />
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No feedback available yet
            </Text>
          )}

          <View style={styles.barLegendContainer}>
            <Text
              style={[styles.barLegend, { color: colors.primary }]}
              testID="driverScore-positiveLegend"
            >
              Positive
            </Text>
            <Text
              style={[styles.barLegend, { color: colors.error }]}
              testID="driverScore-reportsLegend"
            >
              Reports
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  label: { fontSize: 16, marginBottom: 6 },
  emptyText: { fontSize: 16, fontStyle: 'italic', marginBottom: 6 },
  score: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  errorText: { textAlign: 'center', marginVertical: 20, fontSize: 16 },
  retryButton: { alignSelf: 'center', padding: 10 },
  retryText: { fontSize: 16 },
  barContainer: {
    flexDirection: 'row',
    height: 16,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  barLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  barLegend: { fontSize: 14 },
});

export default DriverScoreScreen;
