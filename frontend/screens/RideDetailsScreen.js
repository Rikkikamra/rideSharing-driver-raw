
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const RideDetailsScreen = ({ route }) => {
  const { ride } = route.params;
  const navigation = useNavigation();
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);

  const confirmRide = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        'https://your-backend-url.com/api/bookings/driver-confirm',
        {
          rideId: ride._id,
          vehicleId: user.defaultVehicleId, // assuming it's stored in context
          acceptedReturn: ride.hasReturnOption || false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      Alert.alert('Success', 'Ride confirmed!');
      navigation.navigate('MyTripsScreen');
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Summary</Text>
      <Text>From: {ride.from}</Text>
      <Text>To: {ride.to}</Text>
      <Text>Date: {ride.date}</Text>

      <TouchableOpacity style={styles.button} onPress={confirmRide} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirm Ride</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, marginBottom: 20 },
  button: {
    backgroundColor: '#cc5500',
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default RideDetailsScreen;
