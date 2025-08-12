// RideCard.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RideCard({ ride, onPress }) {
  if (!ride) return null;

  const {
    from,
    to,
    departureTime,
    fare,
    passengers = 1,
    rideType = 'Standard',
  } = ride;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.routeRow}>
        <Ionicons name="location-outline" size={20} color="#E4572E" />
        <Text style={styles.locationText}>{from}</Text>
        <Ionicons name="arrow-forward" size={16} color="#333" style={styles.arrowIcon} />
        <Text style={styles.locationText}>{to}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>
          🕒 {new Date(departureTime).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </Text>
        <Text style={styles.detailText}>👥 {passengers} rider{passengers > 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.fareText}>💰 ${fare?.toFixed(2) || '0.00'}</Text>
        <Text style={styles.typeBadge}>{rideType}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff8f2',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 4,
  },
  arrowIcon: {
    marginHorizontal: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E4572E',
  },
  typeBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#E4572E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
