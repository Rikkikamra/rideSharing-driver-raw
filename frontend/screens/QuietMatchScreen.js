// frontend/screens/QuietMatchScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Group ride matching is currently unimplemented on the server.
const QuietMatchScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { riderId, from, to, date } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    // Placeholder: no network call. Replace with real /match/group later.
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {suggested ? (
        <>
          <Text style={[styles.title, { color: colors.primary }]}>🎧 Quiet Group Ride Suggested</Text>
          <Text style={[styles.desc, { color: colors.text }]}>
            We found {matchCount} other students going your way with Quiet Mode on.
          </Text>
          <Button
            title="Join Quiet Group Ride"
            onPress={() => navigation.navigate('LetsDrive', { from, to, groupMode: true })}
          />
          <Button
            title="Book Solo"
            onPress={() => navigation.navigate('LetsDrive', { from, to, groupMode: false })}
          />
        </>
      ) : (
        <>
          <Text style={[styles.title, { color: colors.primary }]}>No Group Ride Match</Text>
          <Text style={[styles.desc, { color: colors.text }]}>
            You're the first rider for this route and time window.
          </Text>
          <Button
            title="Book Solo Ride"
            onPress={() => navigation.navigate('LetsDrive', { from, to, groupMode: false })}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  desc: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});

export default QuietMatchScreen;
