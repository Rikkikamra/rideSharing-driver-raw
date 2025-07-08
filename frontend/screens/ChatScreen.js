import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fetchTripChatMessages, sendTripChatMessage } from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = ({ route }) => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const tripId = route?.params?.tripId;

  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await fetchTripChatMessages(tripId);
      setMessages(msgs || []);
    };
    loadMessages();
    // Optional: Add polling or websocket for real-time updates
  }, [tripId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = await sendTripChatMessage(tripId, input);
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.msgBubble,
        {
          backgroundColor: item.from === 'rider' ? colors.card : colors.primary,
          alignSelf: item.from === 'rider' ? 'flex-start' : 'flex-end',
        },
      ]}
    >
      <Text style={{ color: item.from === 'rider' ? colors.text : '#fff' }}>{item.text}</Text>
      <Text style={styles.msgTime}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={[styles.header, { color: colors.primary }]}>Trip Chat</Text>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, idx) => idx.toString()}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 60 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      <View style={[styles.inputBar, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Type your message..."
          placeholderTextColor={colors.text + '88'}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <Ionicons name="send" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  header: { fontSize: 22, fontWeight: 'bold', margin: 12 },
  messageList: { flex: 1, paddingHorizontal: 10 },
  msgBubble: { borderRadius: 16, marginVertical: 4, padding: 12, maxWidth: '75%' },
  msgTime
