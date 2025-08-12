import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ApplicationSubmittedScreen = ({ navigation, route }) => {
  const { firstName, lastName } = route.params;
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Application Submitted</Text>
      <Text style={[styles.text, { color: colors.text }]}>Thank you, {firstName} {lastName}. Your application has been submitted.</Text>
      <TouchableOpacity style={[styles.button, { borderColor: colors.primary }]} onPress={() => navigation.navigate('ApplicationForm')}>
        <Text style={{ color: colors.primary }}>Edit Application</Text>
      </TouchableOpacity>
      <Text style={[styles.note, { color: colors.text }]}>You can edit your application until it moves to review.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  button: { padding: 10, borderWidth: 1, borderRadius: 6, marginBottom: 15 },
  note: { fontSize: 12, textAlign: 'center' }
});

export default ApplicationSubmittedScreen;