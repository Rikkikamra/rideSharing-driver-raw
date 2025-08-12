// frontend/screens/HelpCenterScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { API_BASE_URL } from '@env';

// Use the unified API_BASE_URL from the environment.  See the `.env`
// file at the project root for configuration.  Do not fall back to
// hard‑coded values so that the application can be pointed to
// development, staging or production servers without code changes.

export default function HelpCenterScreen() {
  const { colors } = useTheme();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    axios.get(`${API_BASE_URL}/faqs`)
      .then(res => {
        if (mounted) {
          setFaqs(res.data.faqs || []);
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
      });
    return () => { mounted = false };
  }, []);

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
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : faqs.length > 0 ? (
          faqs.map((faq, idx) => (
            <View key={faq._id || idx} style={{ marginBottom: 14 }}>
              <Text style={[styles.description, { color: colors.text, fontWeight: 'bold' }]}>{faq.question}</Text>
              <Text style={[styles.description, { color: colors.text }]}>{faq.answer}</Text>
            </View>
          ))
        ) : (
          <Text style={[styles.description, { color: colors.text }]}>No FAQs available at the moment.</Text>
        )}
      </View>
    </ScrollView>
  );
}

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
