import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { submitAppFeedback } from '../utils/api';

const FeedbackScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Feedback required', 'Please enter your feedback.');
      return;
    }
    setLoading(true);
    const result = await submitAppFeedback(feedback);
    setLoading(false);
    if (result?.success) {
      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Unable to submit feedback. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>App Feedback</Text>
      <Text style={{ color: colors.text, marginBottom: 10 }}>Share your suggestions or issues with us.</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
        multiline
        numberOfLines={4}
        value={feedback}
        onChangeText={setFeedback}
        placeholder="Type your feedback here..."
        placeholderTextColor={colors.text + '77'}
      />
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
          {loading ? 'Submitting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 18 },
  input: {
    width: '90%',
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  btn: {
    width: '90%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
    elevation: 2,
  },
});

export default FeedbackScreen;
