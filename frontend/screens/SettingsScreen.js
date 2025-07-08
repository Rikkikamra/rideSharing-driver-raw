import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.header, { color: colors.primary }]}>Settings</Text>
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ChangePassword')}>
        <Ionicons name="lock-closed-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Rewards')}>
        <Ionicons name="gift-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Rewards</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('HelpCenter')}>
        <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Help Center</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('About')}>
        <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 18, paddingTop: 40, paddingBottom: 32 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 18 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: { fontSize: 17, marginLeft: 14 },
  logoutBtn: {
    marginTop: 40,
    backgroundColor: '#FF5722',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    elevation: 2,
  },
});

export default SettingsScreen;
