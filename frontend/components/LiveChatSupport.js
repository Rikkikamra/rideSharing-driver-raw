/* eslint-disable react-native/no-inline-styles */

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const LiveChatScreen = () => {
  const { theme } = useContext(ThemeContext);

  const SUPPORT_URL = 'https://swiftcampus-support.chatbot.com';

  const startLiveChat = async () => {
    try {
      const supported = await Linking.canOpenURL(SUPPORT_URL);
      if (supported) {
        Linking.openURL(SUPPORT_URL);
      } else {
        Alert.alert('Not Supported', 'Your device cannot open this link.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Ionicons name="chatbubbles-outline" size={64} color={theme.accent} style={{ marginBottom: 20 }} />
      <Text style={[styles.header, { color: theme.text }]}>Live Chat Support</Text>
      <Text style={[styles.subtext, { color: theme.muted }]}>
        Agents typically respond in under 5 minutes.
      </Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={startLiveChat}>
        <Text style={styles.buttonText}>Start Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LiveChatScreen;
