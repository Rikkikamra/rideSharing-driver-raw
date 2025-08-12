import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { AuthContext } from '../context/AuthProvider';

export default function RewardsScreen() {
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();

  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState('');
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!user?.id) return;
    api
      .get(`/rewards/${user.id}`)
      .then((res) => {
        if (mounted) {
          setPoints(res.data.points || 0);
          setTier(res.data.currentTier || res.data.tier || '');
          setBadges(res.data.badges || []);
        }
      })
      .catch(() => {
        if (mounted) setError('Unable to load rewards.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
        mounted = false;
    };
  }, [user?.id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Your Rewards</Text>
      <View style={styles.summary}>
        <Text style={[styles.points, { color: colors.text }]}>{points} Points</Text>
        <Text style={[styles.tier, { color: colors.text }]}>{tier} Tier</Text>
      </View>
      <Text style={[styles.subheader, { color: colors.text }]}>Badges</Text>
      <FlatList
        data={badges}
        keyExtractor={(item, idx) => `${item}-${idx}`}
        renderItem={({ item }) => (
          <View style={[styles.badgeContainer, { borderColor: colors.border }]}>
            <Text style={[styles.badgeText, { color: colors.text }]}>{item}</Text>
          </View>
        )}
        contentContainerStyle={styles.badgesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  points: {
    fontSize: 20,
    fontWeight: '600',
  },
  tier: {
    fontSize: 20,
    fontWeight: '600',
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badgeContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 14,
  },
});
