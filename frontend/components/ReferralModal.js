// frontend/components/ReferralModal.js

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Share, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const ReferralModal = ({ visible, onClose, code }) => {
  const { notify } = useNotification();
  const { colors, fonts, borders } = useTheme();

  const handleShare = async () => {
    try {
      if (!code) return;
      const message = `Join SwiftCampus and earn rewards! Use my referral code: ${code}`;
      await Share.share({ message });
    } catch {
      notify('Error', 'Could not share referral code.');
    }
  };

  const handleCopy = async () => {
    try {
      if (!code) return;
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        await Clipboard.setStringAsync(code);
      }
      notify('Copied', 'Referral code copied to clipboard.');
    } catch {
      notify('Error', 'Could not copy referral code.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.modalBackground || 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modal, { backgroundColor: colors.card, borderRadius: borders.radius }]}>
          <Text style={[styles.header, { color: colors.primary, fontSize: fonts.size.title }]}>Invite Friends</Text>
          <Text style={[styles.subtext, { color: colors.text, fontSize: fonts.size.input }]}>
            Share your code with friends and earn rewards when they join and take their first ride!
          </Text>

          <Text style={[styles.label, { color: colors.muted }]}>Your Referral Code:</Text>
          <Text selectable style={[styles.code, { color: colors.accent }]}>{code}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: colors.accent, borderRadius: borders.radius }]}
              onPress={handleShare}
              disabled={!code}
            >
              <Text style={[styles.shareBtnText, { color: colors.white, fontSize: fonts.size.button }]}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.copyBtn,
                { backgroundColor: colors.card, borderColor: colors.accent, borderWidth: 1, borderRadius: borders.radius },
              ]}
              onPress={handleCopy}
              disabled={!code}
            >
              <Text style={[styles.copyBtnText, { color: colors.accent, fontSize: fonts.size.button }]}>Copy</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.primary, borderRadius: borders.radius }]}
            onPress={onClose}
          >
            <Text style={[styles.closeBtnText, { color: colors.white, fontSize: fonts.size.button }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modal: { padding: 28, width: '85%', alignItems: 'center' },
  header: { fontWeight: 'bold', marginBottom: 8 },
  subtext: { textAlign: 'center', marginBottom: 14 },
  label: { marginTop: 8, marginBottom: 5 },
  code: { fontWeight: '600', marginBottom: 12 },
  buttonRow: { flexDirection: 'row', marginBottom: 16, marginTop: 6 },
  shareBtn: { marginRight: 10, paddingHorizontal: 20, paddingVertical: 8 },
  shareBtnText: { fontWeight: 'bold' },
  copyBtn: { paddingHorizontal: 18, paddingVertical: 8 },
  copyBtnText: { fontWeight: 'bold' },
  closeBtn: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10 },
  closeBtnText: { fontWeight: 'bold' },
});

export default ReferralModal;
