import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Share, Clipboard, Platform, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';

const ReferralModal = ({ visible, onClose, code }) => {
  const { colors } = useTheme();

  const handleShare = async () => {
    try {
      const message = `Join SwiftCampus and earn rewards! Use my referral code: ${code}`;
      await Share.share({ message });
    } catch (error) {
      Alert.alert('Error', 'Could not share referral code.');
    }
  };

  const handleCopy = () => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(code);
    } else {
      Clipboard.setString(code);
    }
    Alert.alert('Copied', 'Referral code copied to clipboard.');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.card }]}>
          <Text style={[styles.header, { color: colors.primary }]}>Invite Friends</Text>
          <Text style={[styles.subtext, { color: colors.text }]}>
            Share your code with friends and earn rewards when they join and take their first ride!
          </Text>
          <Text style={styles.label}>Your Referral Code:</Text>
          <Text selectable style={styles.code}>{code}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.shareBtnText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              <Text style={styles.copyBtnText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center' },
  modal: { padding: 28, borderRadius: 16, width: '85%', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subtext: { fontSize: 14, textAlign: 'center', marginBottom: 14 },
  label: { fontSize: 15, marginTop: 8, marginBottom: 5, color: '#a25922' },
  code: { fontSize: 20, fontWeight: '600', color: '#d97706', marginBottom: 12 },
  buttonRow: { flexDirection: 'row', marginBottom: 16, marginTop: 6 },
  shareBtn: { backgroundColor: '#d97706', borderRadius: 10, marginRight: 10, paddingHorizontal: 20, paddingVertical: 8 },
  shareBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  copyBtn: { backgroundColor: '#fff6e0', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 8, borderWidth: 1, borderColor: '#d97706' },
  copyBtnText: { color: '#d97706', fontWeight: 'bold', fontSize: 16 },
  closeBtn: { marginTop: 16, backgroundColor: '#a25922', borderRadius: 8, paddingHorizontal: 28, paddingVertical: 10 },
  closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ReferralModal;