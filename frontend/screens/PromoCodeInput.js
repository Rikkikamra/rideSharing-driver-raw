import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { applyPromoCode } from '../utils/api';

const PromoCodeInput = ({ navigation }) => {
  const { colors } = useTheme();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      Alert.alert('Enter Promo Code', 'Please enter a promo code.');
      return;
    }
    setLoading(true);
    const result = await applyPromoCode(code);
    setLoading(false);
    if (result?.success) {
      Alert.alert('Success', 'Promo code applied successfully!');
      navigation.goBack();
    } else {
      Alert.alert('Invalid Code', result?.message || 'Could not apply promo code.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Enter Promo Code</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
        value={code}
        onChangeText={setCode}
        placeholder="Promo code"
        placeholderTextColor={colors.text + '77'}
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
        onPress={handleApply}
        disabled={loading}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
          {loading ? 'Applying...' : 'Apply Code'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '80%',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    marginVertical: 18,
  },
  btn: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
  },
});

export default PromoCodeInput;
