import React, { useContext } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthProvider';

const MenuScreen = () => {
  const { colors } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  // Log out then replace the navigation stack
  const handleLogout = async () => {
    await logout();
    navigation.replace('LoginScreen');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.profileContainer}>
        {user?.avatar && (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        )}
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.fullName}
        </Text>
        {user?.email && (
          <Text style={[styles.email, { color: colors.text }]}>
            {user.email}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('AccountScreen')}
      >
        <Ionicons name="person-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Earnings')}
      >
        <Ionicons name="wallet-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Earnings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Rewards')}
      >
        <Ionicons name="gift-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Rewards</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Help')}
      >
        <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Help Center</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('SettingsScreen')}
      >
        <Ionicons name="settings-outline" size={22} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    marginLeft: 16,
    fontSize: 16,
  },
  logoutBtn: {
    marginTop: 40,
    marginHorizontal: 20,
    backgroundColor: '#FF5722',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 2,
  },
});

export default MenuScreen;
