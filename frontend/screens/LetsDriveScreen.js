import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MenuPanel from '../components/MenuPanel';
import RideCard from '../components/RideCard';
import WeatherWidget from '../components/WeatherWidget';
import EarningsSummary from '../components/EarningsSummary';
import { fetchAvailableRides, fetchDriverEarnings } from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

const LetsDriveScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [rides, setRides] = useState([]);
  const [earnings, setEarnings] = useState({ day: 0, week: 0, month: 0 });
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all open rides from the server.  Wrap in try/catch
  // to handle potential network errors gracefully.
  const loadRides = async () => {
    setRefreshing(true);
    try {
      const available = await fetchAvailableRides();
      setRides(available || []);
    } catch (err) {
      console.error('Error loading rides', err);
      setRides([]);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch the driver’s earnings for the current day, week and month.
  const loadEarnings = async () => {
    try {
      const data = await fetchDriverEarnings();
      setEarnings(data || { day: 0, week: 0, month: 0 });
    } catch (err) {
      console.error('Error loading earnings', err);
      setEarnings({ day: 0, week: 0, month: 0 });
    }
  };

  // On component mount, load rides and earnings
  useEffect(() => {
    loadRides();
    loadEarnings();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>Let's Drive</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <EarningsSummary earnings={earnings} />
      <WeatherWidget />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Rides</Text>
      <ScrollView
        contentContainerStyle={styles.rideList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadRides} tintColor={colors.primary} />
        }
      >
        {rides.length === 0 ? (
          <Text style={{ color: colors.text, marginTop: 32, textAlign: 'center' }}>
            No rides available. Pull to refresh.
          </Text>
        ) : (
          rides.map((ride) => (
            <RideCard
              key={ride._id}
              ride={ride}
              onPress={() => navigation.navigate('RideDetails', { rideId: ride._id })}
            />
          ))
        )}
      </ScrollView>
      <MenuPanel visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 12,
    marginLeft: 4,
  },
  rideList: {
    paddingBottom: 32,
  },
});

export default LetsDriveScreen;
