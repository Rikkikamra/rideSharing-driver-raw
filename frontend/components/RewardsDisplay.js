
import React, { useEffect, useState } from 'react';
import apiClient from '../utils/api';
import { View, Text, StyleSheet, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ProgressViewIOS } from '@react-native-community/progress-view';

const TIERS = [
  { name: 'Bronze', next: 500, color: '#cd7f32' },
  { name: 'Silver', next: 1000, color: '#C0C0C0' },
  { name: 'Gold', next: 2000, color: '#FFD700' },
  { name: 'Platinum', next: 5000, color: '#b4e0ff' },
];

export default function RewardsDisplay({ userId }) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchRewards() {
      setLoading(true);
      setError(null);
      try {
        // Use the shared Axios client to fetch rewards.  This ensures
        // that the base URL and auth headers are consistent across the app.
        const res = await apiClient.get(`/rewards/${userId}`);
        if (mounted) setRewards(res.data);
      } catch (err) {
        if (mounted) setError('Unable to load rewards');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (userId) fetchRewards();
    return () => { mounted = false; };
  }, [userId]);

  if (loading) {
    return <ActivityIndicator style={{ margin: 24 }} size="large" color={colors.primary} />;
  }
  if (error) {
    return <View style={styles.center}><Text style={{ color: colors.error || '#d32f2f' }}>{error}</Text></View>;
  }
  if (!rewards) {
    return <View style={styles.center}><Text>No rewards data available.</Text></View>;
  }

  const currentTierObj = TIERS.find(t => t.name === rewards.tier) || TIERS[0];
  const progress = Math.min(rewards.points / currentTierObj.next, 1);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.primary }]}>🎁 Your Rewards</Text>
      <Text style={styles.points}>
        Points: <Text style={{ color: '#d97706', fontWeight: 'bold' }}>{rewards.points}</Text>
      </Text>
      <Text style={[styles.tier, { color: currentTierObj.color }]}>Tier: {rewards.tier}</Text>

      {Platform.OS === 'ios' && ProgressViewIOS ? (
        <ProgressViewIOS
          progress={progress}
          progressTintColor={currentTierObj.color}
          style={styles.progress}
        />
      ) : (
        <View style={[styles.androidBar, { backgroundColor: '#fff6e0', borderColor: currentTierObj.color }]}>
          <View style={{ flex: progress, backgroundColor: currentTierObj.color, borderRadius: 8 }} />
          <View style={{ flex: 1 - progress }} />
        </View>
      )}

      <Text style={styles.nextText}>
        {rewards.points >= currentTierObj.next
          ? '🎉 You reached this tier!'
          : `${currentTierObj.next - rewards.points} pts to next level`}
      </Text>

      {Array.isArray(rewards.badges) && rewards.badges.length > 0 && (
        <View style={styles.badgeSection}>
          <Text style={styles.badgeLabel}>Badges Earned:</Text>
          <View style={styles.badgesRow}>
            {rewards.badges.map(badge => (
              <Text key={badge} style={styles.badge}>{badge}</Text>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, borderRadius: 12, marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  points: { fontSize: 17, marginBottom: 2, color: '#333' },
  tier: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  progress: { marginTop: 10, height: 10, width: '100%', borderRadius: 5 },
  androidBar: { width: '100%', height: 10, borderRadius: 8, flexDirection: 'row', marginTop: 10, overflow: 'hidden', borderWidth: 1 },
  nextText: { marginTop: 8, fontSize: 13, color: '#777' },
  badgeSection: { marginTop: 12, alignItems: 'center' },
  badgeLabel: { fontWeight: 'bold', color: '#a25922', fontSize: 14 },
  badgesRow: { flexDirection: 'row', marginTop: 4 },
  badge: { backgroundColor: '#ffe5b4', color: '#d97706', borderRadius: 8, paddingHorizontal: 10, marginHorizontal: 4, fontWeight: '600' },
  center: { alignItems: 'center', justifyContent: 'center', minHeight: 120 }
});
