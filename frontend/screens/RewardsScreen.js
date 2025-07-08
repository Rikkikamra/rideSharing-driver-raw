
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import RewardsDisplay from '../components/RewardsDisplay';
import { ThemeContext } from '../context/ThemeContext';

const RewardsScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState('Bronze');
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // Simulate fetching rewards data
    const userData = {
      points: 960,
      tier: 'Silver',
      badges: ['First Ride', '5-Star Rider', 'Referral Champ'],
    };
    setPoints(userData.points);
    setTier(userData.tier);
    setBadges(userData.badges);
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Your Rewards</Text>
      <RewardsDisplay points={points} tier={tier} />

      <Text style={[styles.subHeader, { color: theme.text }]}>Earn More Points</Text>
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardText, { color: theme.text }]}>🎁 Refer a friend and earn 100 points!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardText, { color: theme.text }]}>🧾 Complete 5 rides this month for a bonus!</Text>
      </TouchableOpacity>

      <Text style={[styles.subHeader, { color: theme.text }]}>Badges Earned</Text>
      {badges.map((badge, index) => (
        <View key={index} style={[styles.badge, { backgroundColor: theme.accent }]}>
          <Text style={styles.badgeText}>🏅 {badge}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
  },
  badge: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RewardsScreen;
