import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../utils/api';

// Polls backend for driver onboarding status and routes accordingly.
export default function ApplicationInReviewScreen() {
  const navigation = useNavigation();
  const { notify } = useNotification();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const checkStatus = async () => {
      try {
        // Base URL already includes `/api`.
        const res = await apiClient.get('/driver/onboarding/status');
        const { onboardingStatus, rejectionReason } = res.data || {};

        if (onboardingStatus === 'APPROVED') {
          notify('Approved 🎉', 'Your driver application has been approved.');
          clearInterval(intervalId);
          navigation.replace('ApplicationApproved');
        } else if (onboardingStatus === 'REJECTED') {
          notify('Rejected ⚠️', rejectionReason || 'Your application was rejected.');
          clearInterval(intervalId);
          navigation.replace('ApplicationRejected', { reason: rejectionReason });
        }
      } catch (err) {
        // Optional: surface an error toast if you want
        // notify('Error', 'Unable to check status. Retrying…');
        console.error('Status check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    // initial poll and then repeat every 10s
    checkStatus();
    intervalId = setInterval(checkStatus, 10000);

    return () => clearInterval(intervalId);
  }, [navigation, notify]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.text }]}>
        Thanks for applying! We’re reviewing your details now.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { marginTop: 16, fontSize: 16, textAlign: 'center' },
});
