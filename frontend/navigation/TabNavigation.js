// frontend/navigation/TabNavigation.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ProtectedRoute from '../components/ProtectedRoute';

import LetsDriveScreen from '../screens/LetsDriveScreen';
import TripsScreen from '../screens/TripHistoryScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ReferralScreen from '../screens/ReferralScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LiveChatSupport from '../components/LiveChatSupport'; // ok if you kept the component
import FeedbackScreen from '../screens/FeedbackScreen';
import PromoCodeInput from '../screens/PromoCodeInput';
import SavedPlacesScreen from '../screens/SavedPlacesScreen'; // re-exports MyPlacesScreen
import QuietPreferenceSettings from '../screens/QuietPreferenceSettings';
import AccountScreen from '../screens/AccountScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import TermsPolicyScreen from '../screens/TermsPolicyScreen';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const { colors, borders } = useTheme();

  const tabBarIcon = ({ color, size, focused, route }) => {
    let iconName = 'ellipse';

    switch (route.name) {
      case "Let's Drive":
        iconName = focused ? 'car-sport' : 'car-sport-outline';
        break;
      case 'My Trips':
        iconName = focused ? 'time' : 'time-outline';
        break;
      case 'Rewards':
        iconName = focused ? 'gift' : 'gift-outline';
        break;
      case 'Feedback':
        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        break;
      case 'Refer':
        iconName = focused ? 'share-social' : 'share-social-outline';
        break;
      case 'PromoCode':
        iconName = focused ? 'pricetags' : 'pricetags-outline';
        break;
      case 'Help':
        iconName = focused ? 'help-circle' : 'help-circle-outline';
        break;
      case 'SavedPlaces':
        iconName = focused ? 'bookmark' : 'bookmark-outline';
        break;
      case 'Support':
        iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
        break;
      case 'QuietPreferences':
        iconName = focused ? 'volume-mute' : 'volume-mute-outline';
        break;
      case 'Settings':
        iconName = focused ? 'settings' : 'settings-outline';
        break;
      default:
        break;
    }
    return <Ionicons name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      initialRouteName="Let's Drive"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopLeftRadius: borders.radius,
          borderTopRightRadius: borders.radius,
          height: 60,
          paddingBottom: 6,
        },
        tabBarIcon: ({ color, size, focused }) => tabBarIcon({ color, size, focused, route }),
      })}
    >
      <Tab.Screen name="Let's Drive" component={ProtectedRoute(LetsDriveScreen)} />
      <Tab.Screen name="My Trips" component={ProtectedRoute(TripsScreen)} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Feedback" component={FeedbackScreen} />
      <Tab.Screen name="Refer" component={ReferralScreen} />
      <Tab.Screen name="PromoCode" component={PromoCodeInput} />
      <Tab.Screen name="Help" component={HelpCenterScreen} />
      <Tab.Screen name="SavedPlaces" component={SavedPlacesScreen} />
      <Tab.Screen name="Support" component={LiveChatSupport} />
      <Tab.Screen name="QuietPreferences" component={QuietPreferenceSettings} />
      {/* Hidden tabs below — consider moving these to a Stack instead */}
      <Tab.Screen name="AccountScreen" component={AccountScreen} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="TermsPolicy" component={TermsPolicyScreen} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
