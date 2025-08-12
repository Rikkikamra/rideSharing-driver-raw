import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

export default function ApplicationRejectedScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { reason = 'Unfortunately, your application was not approved.' } = route.params || {};
  const { notify } = useNotification();
  const { colors } = useTheme();

  useEffect(() => {
    notify('Application Rejected', reason);
  }, [notify, reason]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.error }]}>Application Rejected</Text>
      <Text style={[styles.reasonLabel, { color: colors.text }]}>Reason:</Text>
      <Text style={[styles.reasonText, { color: colors.text }]}>{reason}</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        You may review your details and resubmit for reconsideration.
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('ApplicationForm')} // <-- use your actual route name
      >
        <Text style={styles.buttonText}>Resubmit Application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  reasonLabel: { fontSize: 16, fontWeight: '600', alignSelf: 'flex-start', marginBottom: 4 },
  reasonText: { fontSize: 16, marginBottom: 16, alignSelf: 'flex-start' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 24 },
  button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
