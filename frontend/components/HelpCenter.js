import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpCenter = () => {
  const openFAQ = () => Linking.openURL('https://swiftcampus.com/faq');
  const openTerms = () => Linking.openURL('https://swiftcampus.com/terms');
  const contactSupport = () => Linking.openURL('mailto:support@swiftcampus.com');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📚 Help Center</Text>

      <TouchableOpacity style={styles.item} onPress={openFAQ}>
        <Ionicons name="help-circle-outline" size={22} color="#ff6600" />
        <Text style={styles.link}>Frequently Asked Questions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={openTerms}>
        <Ionicons name="document-text-outline" size={22} color="#ff6600" />
        <Text style={styles.link}>Terms & Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={contactSupport}>
        <Ionicons name="mail-outline" size={22} color="#ff6600" />
        <Text style={styles.link}>Contact Support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  link: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007bff',
  },
});

export default HelpCenter;