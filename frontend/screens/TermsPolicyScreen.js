
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const TermsPolicyScreen = () => {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Terms & Policy</Text>

      <Text style={[styles.text, { color: colors.text }]}>
        Welcome to SwiftCampus. By using this app, you agree to our terms and conditions. All drivers are expected to comply with local laws, maintain valid documents, and operate their vehicles safely.
      </Text>

      <Text style={[styles.text, { color: colors.text }]}>
        We collect data to improve your experience and for operational needs. Please read our privacy policy at swiftcampus.com/privacy to understand how your data is handled.
      </Text>

      <Text style={[styles.text, { color: colors.text }]}>
        For full legal terms, please visit swiftcampus.com/terms.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    lineHeight: 24,
    marginBottom: 20,
  },
});

export default TermsPolicyScreen;
