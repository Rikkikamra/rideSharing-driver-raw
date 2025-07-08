
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const HelpCenterScreen = () => {
  const { colors } = useTheme();

  const openSupport = () => {
    Linking.openURL('mailto:support@swiftcampus.com');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Help Center</Text>

      <Text style={[styles.text, { color: colors.text }]}>
        Need help with your account, trips, or payments? Browse our FAQs or contact support.
      </Text>

      <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={openSupport}>
        <Text style={[styles.title, { color: colors.primary }]}>Contact Support</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          Email us at support@swiftcampus.com for quick assistance.
        </Text>
      </TouchableOpacity>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.primary }]}>FAQs</Text>
        <Text style={[styles.description, { color: colors.text }]}>• How to update vehicle documents?</Text>
        <Text style={[styles.description, { color: colors.text }]}>• What to do if a rider cancels?</Text>
        <Text style={[styles.description, { color: colors.text }]}>• How to request a payout?</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    marginBottom: 6,
  },
});

export default HelpCenterScreen;
