import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchSupportMessages, sendSupportMessage } from '../utils/api';

const SupportChatScreen = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await fetchSupportMessages();
      setMessages(msgs || []);
    };
    loadMessages();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = await sendSupportMessage(input);
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.msgBubble,
        {
          backgroundColor: item.from === 'support' ? colors.card : colors.primary,
          alignSelf: item.from === 'support' ? 'flex-start' : 'flex-end',
        },
      ]}
    >
      <Text style={{ color: item.from === 'support' ? colors.text : '#fff' }}>{item.text}</Text>
      <Text style={styles.msgTime}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={[styles.header, { color: colors.primary }]}>Live Support Chat</Text>
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
  msgTime: { fontSize: 11, marginTop: 2, color: '#aaa', textAlign: 'right' },
  inputBar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: { flex: 1, fontSize: 16, padding: 10, minHeight: 40 },
  sendBtn: { padding: 4, marginLeft: 4 },
});

export default SupportChatScreen;
