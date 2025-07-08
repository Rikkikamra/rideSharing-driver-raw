
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const QuietMatchScreen = ({ route, navigation }) => {
  const { riderId, from, to, date } = route.params;
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    axios.post('https://api.swiftcampus.com/api/match/group', {
      riderId, from, to, date
    }).then(res => {
      setSuggested(res.data.suggested);
      setMatchCount(res.data.matchCount);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      {suggested ? (
        <>
          <Text style={styles.title}>🎧 Quiet Group Ride Suggested</Text>
          <Text style={styles.desc}>We found {matchCount} other students going your way with Quiet Mode on.</Text>
          <Button title="Join Quiet Group Ride" onPress={() => navigation.navigate('LetsDriveScreen', {
            from, to, groupMode: true
          })} />
          <Button title="Book Solo" onPress={() => navigation.navigate('LetsDriveScreen', {
            from, to, groupMode: false
          })} />
        </>
      ) : (
        <>
          <Text style={styles.title}>No Group Ride Match</Text>
          <Text style={styles.desc}>You're the first rider for this route and time window.</Text>
          <Button title="Book Solo Ride" onPress={() => navigation.navigate('LetsDriveScreen', {
            from, to, groupMode: false
          })} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  desc: { fontSize: 16, textAlign: 'center', marginBottom: 20 }
});

export default QuietMatchScreen;
