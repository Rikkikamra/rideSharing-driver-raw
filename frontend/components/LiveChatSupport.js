/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, StyleSheet } from 'react-native';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { SUPPORT_CHAT_URL } from '../utils/constants';

const LiveChatScreen = () => {
  // Extract notify within the function body.  The previous syntax
  // attempted to destructure notify in the component parameters,
  // which is invalid.  We also consume the theme from ThemeContext.
  const { notify } = useNotification();
  // Use the custom useTheme hook to access colours and other tokens.
  const { colors } = useTheme();


  const startLiveChat = async () => {
    try {
      const supported = await Linking.canOpenURL(SUPPORT_CHAT_URL);
      if (supported) {
        Linking.openURL(SUPPORT_CHAT_URL);
      } else {
        notify('Not Supported', 'Your device cannot open this link.');
      }
    } catch (error) {
      notify('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Ionicons
        name="chatbubbles-outline"
        size={64}
        color={colors.accent}
        style={{ marginBottom: 20 }}
      />
      <Text style={[styles.header, { color: colors.text }]}>Live Chat Support</Text>
      <Text style={[styles.subtext, { color: colors.muted }]}> 
        Agents typically respond in under 5 minutes.
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={startLiveChat}
      >
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
