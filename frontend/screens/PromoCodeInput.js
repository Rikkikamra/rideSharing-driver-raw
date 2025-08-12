// frontend/screens/PromoCodeInput.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNotification } from '../context/NotificationContext';
import { applyPromoCode } from '../utils/api';
import { COLORS, FONTS, BORDERS } from '../theme';

/**
 * PromoCodeInput
 *
 * Collects a promo code from the user and attempts to apply it via the
 * back‑end.  The original implementation injected a destructured notify
 * call into the component argument list and relied on a non‑existent
 * ThemeContext.  This version fixes those issues and uses theme constants.
 */
const PromoCodeInput = ({ navigation }) => {
  const { notify } = useNotification();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      notify({ title: 'Enter Promo Code', message: 'Please enter a promo code.' });
      return;
    }
    setLoading(true);
    try {
      const result = await applyPromoCode(code.trim());
      if (result?.success) {
        notify({ title: 'Success', message: 'Promo code applied successfully!' });
        navigation.goBack();
      } else {
        notify({ title: 'Invalid Code', message: result?.message || 'Could not apply promo code.' });
      }
    } catch (err) {
      notify({ title: 'Error', message: err.message || 'Could not apply promo code.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Promo Code</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="Promo code"
        placeholderTextColor={COLORS.grey}
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleApply}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Apply Code</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28, backgroundColor: COLORS.background },
  header: { fontSize: FONTS.size.title, fontFamily: FONTS.bold, marginBottom: 20, color: COLORS.burntOrange },
  input: {
    width: '80%',
    borderWidth: BORDERS.width,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDERS.radius,
    padding: 12,
    fontSize: FONTS.size.input,
    marginVertical: 18,
    backgroundColor: COLORS.inputBg,
    color: COLORS.black,
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: BORDERS.radius,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: COLORS.burntOrange,
  },
  buttonText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: FONTS.size.button },
});

export default PromoCodeInput;
