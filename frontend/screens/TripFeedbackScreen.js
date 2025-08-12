// frontend/screens/TripFeedbackScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import {
  fetchTripFeedback,
} from '../../../utils/api';
// Use the dedicated feedback helper to submit trip feedback.  This avoids
// duplicating the implementation and uses the correct endpoint.
import { submitTripFeedback } from '../../../utils/feedbackLogic';
import { hexToRgba } from '../../../utils/color'; // ← new utility import

const BADGES = [
  { id: 'friendly', label: 'Friendly' },
  { id: 'punctual',  label: 'Punctual' },
  { id: 'helpful',  label: 'Helpful' },
  // add more badges here
];

const TripFeedbackScreen = ({ navigation, route }) => {
  const tripId = route.params?.tripId;
  const { notify } = useNotification();
  const { colors } = useTheme();

  const [rating, setRating] = useState(0);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 1️⃣ Ensure tripId, then fetch existing feedback
  useEffect(() => {
    if (!tripId) {
      Alert.alert('Error', 'Missing trip information.');
      navigation.goBack();
      return;
    }
    (async () => {
      try {
        const { feedback } = await fetchTripFeedback(tripId);
        // if feedback exists, prefill UI
        if (feedback) {
          setRating(feedback.rating);
          setSelectedBadges(feedback.badges);
          setComments(feedback.comments || '');
        }
      } catch (err) {
        // silent fail: no existing feedback
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [tripId]);

  const toggleBadge = (badgeId) => {
    setSelectedBadges((prev) =>
      prev.includes(badgeId)
        ? prev.filter((id) => id !== badgeId)
        : [...prev, badgeId]
    );
  };

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      notify('Rating required', 'Please select 1–5 stars.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        rating,
        badges: selectedBadges,
        comments: comments.trim() || null,
      };
      await submitTripFeedback(tripId, payload);
      notify('Thank you!', 'Your feedback has been submitted.');
      navigation.goBack();
    } catch (err) {
      notify('Error', err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Show loader while fetching existing feedback
  if (initialLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Close feedback form"
        >
          <Text style={[styles.closeText, { color: colors.text }]}>×</Text>
        </TouchableOpacity>

        <Text style={[styles.header, { color: colors.primary }]}>
          Trip Feedback
        </Text>
        <Text style={[styles.subheader, { color: colors.text }]}>
          How was the rider?
        </Text>

        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              testID={`star-${star}`}
            >
              <FontAwesome
                name={star <= rating ? 'star' : 'star-o'}
                size={32}
                color={star <= rating ? colors.primary : colors.text}
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.badgesContainer}>
          {BADGES.length === 0 ? (
            <Text
              style={[styles.emptyBadgesText, { color: colors.text }]}
            >
              No badges available.
            </Text>
          ) : (
            BADGES.map((badge) => {
              const sel = selectedBadges.includes(badge.id);
              return (
                <TouchableOpacity
                  key={badge.id}
                  style={[
                    styles.badge,
                    {
                      borderColor: sel ? colors.primary : colors.text,
                      backgroundColor: sel
                        ? hexToRgba(colors.primary, 0.125) // ← DRY helper
                        : 'transparent',
                    },
                  ]}
                  onPress={() => toggleBadge(badge.id)}
                  testID={`badge-${badge.id}`}
                >
                  <Text
                    style={{
                      color: sel ? colors.primary : colors.text,
                      fontSize: 14,
                    }}
                  >
                    {badge.label}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <TextInput
          style={[
            styles.input,
            { borderColor: colors.primary, color: colors.text },
          ]}
          multiline
          numberOfLines={4}
          value={comments}
          onChangeText={setComments}
          placeholder="Optional feedback message..."
          placeholderTextColor={`${colors.text}77`}
          testID="feedback-input"
          accessibilityLabel="Feedback message"
        />

        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={loading}
          testID="submit-feedback"
          accessibilityLabel="Submit feedback"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'flex-start' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: { position: 'absolute', top: 20, right: 20, padding: 8 },
  closeText: { fontSize: 28, lineHeight: 28 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 6,
    textAlign: 'center',
  },
  subheader: { fontSize: 16, marginBottom: 16, textAlign: 'center' },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  star: { marginHorizontal: 6 },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyBadgesText: {
    fontSize: 14,
    marginVertical: 8,
    textAlign: 'center',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default TripFeedbackScreen;