import React, { useContext } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthProvider';

const SettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { logout } = useContext(AuthContext);

  // Optionally allow logout from settings
  const handleLogout = async () => {
    await logout();
    navigation.replace('LoginScreen');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.header, { color: colors.primary }]}>Settings</Text>

      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('ChangePassword')}
      >
        <Ionicons name="lock-closed-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('TermsPolicy')}
      >
        <Ionicons
          name="information-circle-outline"
          size={22}
          color={colors.primary}
        />
        <Text style={[styles.label, { color: colors.text }]}>Terms & Policy</Text>
      </TouchableOpacity>

      {/* Leave logout optional in settings; remove if you prefer it only in the menu */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
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
