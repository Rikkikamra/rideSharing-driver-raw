// frontend/components/MenuPanel.js

import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

const MenuPanel = ({ visible, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const { colors } = useTheme();
  const { notify } = useNotification();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('LoginScreen');
    } catch (e) {
      notify('Logout Failed', 'Unable to log out. Please try again.');
    }
  };

  const menuItems = [
    { label: 'Account', route: 'AccountScreen' },
    { label: 'Earnings', route: 'EarningsScreen' },
    { label: 'Help Center', route: 'HelpCenterScreen' },
    { label: 'Settings', route: 'SettingsScreen' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.modalBackground || 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.panel, { backgroundColor: colors.background }]}>
          <ScrollView contentContainerStyle={styles.content}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: colors.text }]}>×</Text>
            </TouchableOpacity>

            <View style={styles.profileSection}>
              <Image
                source={
                  user?.profileImage
                    ? { uri: user.profileImage }
                    : require('../assets/profile-placeholder.png')
                }
                style={styles.profileImage}
              />
              <Text style={[styles.name, { color: colors.text }]}>
                {user?.fullName || 'Driver'}
              </Text>
            </View>

            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.route}
                onPress={() => {
                  onClose();
                  navigation.navigate(item.route);
                }}
                style={styles.menuItem}
              >
                <Text style={[styles.menuText, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={handleLogout} style={[styles.logoutBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  panel: {
    width: '80%',
    padding: 20,
    height: '100%',
  },
  content: {
    paddingBottom: 32,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  menuText: {
    fontSize: 16,
  },
  logoutBtn: {
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MenuPanel;
