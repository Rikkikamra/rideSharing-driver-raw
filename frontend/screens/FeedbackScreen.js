import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../utils/api';

const FeedbackScreen = ({ navigation }) => {
  // access notification and theme inside component to avoid invalid syntax
  const { notify } = useNotification();
  const { colors } = useTheme();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate input
    if (!feedback.trim()) {
      notify('Feedback required', 'Please enter your feedback.');
      return;
    }
    setLoading(true);
    try {
      // Submit general app feedback.  The backend should expose a route
      // such as POST `/feedback/app` to handle unscoped feedback; adjust
      // accordingly if the endpoint differs.
      const res = await apiClient.post('/feedback/app', { feedback: feedback.trim() });
      setLoading(false);
      if (res.data?.success) {
        notify('Thank you!', 'Your feedback has been submitted.');
        navigation.goBack();
      } else {
        notify('Error', res.data?.message || 'Unable to submit feedback. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      notify('Error', 'Unable to submit feedback. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>App Feedback</Text>
      <Text style={{ color: colors.text, marginBottom: 10 }}>
        Share your suggestions or issues with us.
      </Text>
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
