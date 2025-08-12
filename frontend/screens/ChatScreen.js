// Final production‑ready ChatScreen.js
//
// This version builds upon the improved chat screen in the archive and
// includes a safe fallback for SOCKET_BASE_URL.  If SOCKET_BASE_URL is
// undefined, it derives the socket base by stripping '/api' from API_BASE_URL
// so that sockets connect to `/chat` instead of `/api/chat`.  All other
// functionality (optimistic updates, error handling, connection status,
// accessibility) is preserved.

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import io from 'socket.io-client';
import { API_BASE_URL, SOCKET_BASE_URL } from '@env';
import { useTheme } from '../context/ThemeContext';
import {
  fetchTripChatMessages,
  sendTripChatMessage,
  getAccessToken,
} from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = ({ route }) => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [socketError, setSocketError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const flatListRef = useRef(null);
  const socketRef = useRef(null);
  const tripId = route?.params?.tripId;

  // Determine socket base URL: remove trailing '/api' from API_BASE_URL if
  // SOCKET_BASE_URL is not defined.  This allows socket connections to
  // default to the origin when API_BASE_URL includes '/api'.
  const socketBase = SOCKET_BASE_URL || API_BASE_URL.replace(/\/api\/?$/, '');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    fetchTripChatMessages(tripId)
      .then((msgs) => {
        if (mounted) setMessages(msgs || []);
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load messages');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [tripId]);

  // Setup Socket.IO connection and listeners
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getAccessToken();
        const socket = io(`${socketBase}/chat`, {
          auth: { token },
        });
        socketRef.current = socket;
        socket.emit('joinTrip', { tripId });
        socket.on('connect', () => {
          if (mounted) setConnectionStatus('connected');
        });
        socket.on('disconnect', () => {
          if (mounted) setConnectionStatus('disconnected');
        });
        socket.on('newMessage', (msg) => {
          if (!mounted) return;
          setMessages((prev) => {
            const withoutPending = prev.filter(
              (m) => !(m.__temp && m.text === msg.text)
            );
            return [...withoutPending, msg];
          });
          flatListRef.current?.scrollToEnd({ animated: true });
        });
        socket.on('error', (errMsg) => {
          console.warn('Chat socket error:', errMsg);
          if (mounted) setSocketError(errMsg);
        });
      } catch (err) {
        console.warn('Socket connection failed:', err);
        if (mounted) setSocketError(err.message);
      }
    })();
    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.emit('leaveTrip', { tripId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [tripId, socketBase]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const text = input.trim();
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      from: 'you',
      text,
      time: new Date().toISOString(),
      __temp: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput('');
    flatListRef.current?.scrollToEnd({ animated: true });
    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit('sendMessage', { tripId, text }, (res) => {
          if (res?.error) {
            console.warn('Socket send error:', res.error);
            setSocketError(res.error);
          }
        });
      } else {
        const newMsg = await sendTripChatMessage(tripId, text);
        setMessages((prev) => {
          const withoutPending = prev.filter((m) => m.id !== tempId);
          return [...withoutPending, newMsg];
        });
      }
    } catch (err) {
      console.warn('Send failed:', err);
      setSocketError(err.message);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, __failed: true } : m))
      );
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }) => {
    const isRider = item.from === 'rider' || item.from === 'you';
    const backgroundColor = isRider ? colors.card : colors.primary;
    const textColor = isRider ? colors.text : '#fff';
    const opacity = item.__temp ? 0.5 : 1;
    return (
      <View
        style={[
          styles.msgBubble,
          {
            backgroundColor,
            alignSelf: isRider ? 'flex-start' : 'flex-end',
            opacity,
          },
        ]}
      >
        <Text style={{ color: textColor }}>{item.text}</Text>
        <Text style={styles.msgTime}>
          {new Date(item.time).toLocaleTimeString()}
          {item.__temp && ' …'}
          {item.__failed && ' (failed)'}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={[styles.header, { color: colors.primary }]}>Trip Chat</Text>
      {connectionStatus !== 'connected' && (
        <View style={styles.statusBar}>
          <Text style={{ color: colors.warning || colors.primary }}>
            {connectionStatus === 'connecting'
              ? 'Connecting…'
              : 'Offline – messages will be queued'}
          </Text>
        </View>
      )}
      {socketError && (
        <View style={styles.statusBar}>
          <Text style={{ color: colors.error || colors.primary }}>Error: {socketError}</Text>
        </View>
      )}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.primary }]}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setError(null);
              setIsLoading(true);
              fetchTripChatMessages(tripId)
                .then((msgs) => setMessages(msgs || []))
                .catch((err) =>
                  setError(err.message || 'Failed to load messages')
                )
                .finally(() => setIsLoading(false));
            }}
          >
            <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ color: colors.text }}>No messages yet—say hello!</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 80 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}
      <View style={[styles.inputBar, { backgroundColor: colors.card }]}
        accessible accessibilityRole="text" accessibilityLabel="Message input bar">
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Type your message…"
          placeholderTextColor={colors.text + '88'}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          editable={!sending}
          accessibilityLabel="Message input"
          accessibilityHint="Enter your message and press send"
        />
        <TouchableOpacity
          onPress={handleSend}
          style={styles.sendBtn}
          disabled={sending || !input.trim()}
          accessibilityLabel="Send message"
        >
          <Ionicons
            name="send"
            size={24}
            color={
              sending || !input.trim()
                ? colors.text + '55'
                : colors.primary
            }
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 12,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  msgBubble: {
    borderRadius: 16,
    marginVertical: 4,
    padding: 12,
    maxWidth: '75%',
  },
  msgTime: {
    fontSize: 10,
    marginTop: 4,
    color: '#666',
    alignSelf: 'flex-end',
  },
  inputBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  sendBtn: {
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 8,
  },
  retryText: {
    fontWeight: 'bold',
  },
  statusBar: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});

export default ChatScreen;