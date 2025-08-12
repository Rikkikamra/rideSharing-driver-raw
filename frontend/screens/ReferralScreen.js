import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useNotification } from '../context/NotificationContext';
import ReferralModal from '../components/ReferralModal';
import RewardsDisplay from '../components/RewardsDisplay';
import { useBooking } from '../context/BookingContext';
import { useTheme } from '../context/ThemeContext';

export default function ReferralScreen() {
  const { user } = useBooking();
  const [modalVisible, setModalVisible] = useState(false);
  const { notify } = useNotification();
  const referralCode = user?.referralCode || 'N/A';
  const { colors } = useTheme();

  const handleShare = async () => {
    try {
      const message = `Join SwiftCampus and get ride rewards! Use my code: ${referralCode}`;
      await Share.share({ message });
    } catch (error) {
      notify('Error', 'Could not share referral code.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.primary }]}>Refer & Earn</Text>
      <View style={styles.codeSection}>
        <Text style={styles.label}>Your Referral Code:</Text>
        <Text selectable style={styles.code}>{referralCode}</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>Share Code</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.modalBtnText}>See Referral Details</Text>
      </TouchableOpacity>
      <ReferralModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      <RewardsDisplay userId={user?._id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center' },
  heading: { fontSize: 26, fontWeight: 'bold', marginVertical: 10 },
  codeSection: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  label: { fontSize: 16, marginBottom: 8, color: '#a25922' },
  code: {
    fontSize: 22,
    fontWeight: '600',
    color: '#d97706',
    letterSpacing: 1,
    marginBottom: 12,
  },
  shareBtn: {
    backgroundColor: '#d97706',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  shareBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalBtn: { marginTop: 30, backgroundColor: '#a25922', borderRadius: 8, padding: 10 },
  modalBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
