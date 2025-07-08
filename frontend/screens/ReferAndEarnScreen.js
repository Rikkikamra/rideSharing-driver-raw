
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const ReferAndEarnScreen = () => {
  const { colors } = useTheme();

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Join SwiftCampus as a driver and earn bonuses! Sign up here: https://swiftcampus.com/referral',
      });
    } catch (error) {
      console.error('Error sharing referral:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Refer & Earn</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Invite your friends to become drivers and earn bonuses for each successful signup!
      </Text>

      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: colors.primary }]}
        onPress={handleShare}
      >
        <Text style={styles.shareText}>Share Referral Link</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  shareButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReferAndEarnScreen;
