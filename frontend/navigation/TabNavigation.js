// frontend/navigation/TabNavigation.js
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LetsDriveScreen from '../screens/LetsDriveScreen';
import TripsScreen from '../screens/TripHistoryScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ReferralScreen from '../screens/ReferralScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LiveChatSupport from '../components/LiveChatSupport';
import FeedbackScreen from '../screens/FeedbackScreen';
import PromoCodeInput from '../screens/PromoCodeInput';
import SavedPlacesScreen from '../screens/SavedPlacesScreen';
import QuietPreferenceSettings from '../screens/QuietPreferenceSettings';

const Tab = createBottomTabNavigator();

const _tabBarIcon = ({color, size, focused, route}) => {
  let iconName;
  switch (route.name) {
    case "Let's Drive":
      iconName = focused ? 'car-sport' : 'car-sport-outline';
      break;
    case "My Trips":
      iconName = focused ? 'time' : 'time-outline';
      break;
    case 'Rewards':
      iconName = focused ? 'gift' : 'gift-outline';
      break;
    case 'Refer':
      iconName = focused ? 'share-social' : 'share-social-outline';
      break;
    case 'Help':
      iconName = focused ? 'help-circle' : 'help-circle-outline';
      break;
    case 'Support':
      iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
      break;
    case 'Settings':
      iconName = focused ? 'settings' : 'settings-outline';
      break;
    default:
      iconName = 'ellipse';
  }
  return <Ionicons name={iconName} size={size} color={color} />;
};

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Let's Drive"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#BF5700',
        tabBarInactiveTintColor: '#8e8e8e',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 60,
          paddingBottom: 6,
        },
        tabBarIcon: ({ color, size, focused }) => _tabBarIcon({color, size, focused, route}),
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
      <Tab.Screen name="QuitePreferences" component={QuietPreferenceSettings} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
