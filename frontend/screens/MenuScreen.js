import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS, BORDERS } from '../theme';

const MenuScreen = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.profileContainer}>
      <Image source={require('../assets/profile-placeholder.png')} style={styles.profileImage} />
      <Text style={styles.profileName}>Driver Name</Text>
    </View>
    <View style={styles.menuList}>
      {['AccountScreen', 'EarningsScreen', 'HelpCenterScreen'].map(screen => (
        <TouchableOpacity key={screen} style={styles.menuItem} onPress={() => navigation.navigate(screen)}>
          <Text style={styles.menuText}>{screen.replace('Screen', '')}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 56,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3,
    borderColor: COLORS.burntOrange,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  menuList: {
    marginHorizontal: 30,
  },
  menuItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  menuText: {
    fontSize: 18,
    color: COLORS.burntOrange,
    fontFamily: FONTS.bold,
  },
});

export default MenuScreen;
