
import EditProfileScreen from '../screens/EditProfileScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LetsDriveScreen from '../screens/LetsDriveScreen';
import EarningsScreen from '../screens/EarningsScreen';
import AccountScreen from '../screens/AccountScreen';
import DriverScoreScreen from '../screens/DriverScoreScreen';
import DriverResourcesScreen from '../screens/DriverResourcesScreen';
import TermsPolicyScreen from '../screens/TermsPolicyScreen';
import ReferAndEarnScreen from '../screens/ReferAndEarnScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';
import MyVehicleScreen from '../screens/MyVehicleScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LetsDriveScreen" component={LetsDriveScreen} />
    <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
    <Stack.Screen name="AccountScreen" component={AccountScreen} />
    <Stack.Screen name="DriverScoreScreen" component={DriverScoreScreen} />
    <Stack.Screen name="DriverResourcesScreen" component={DriverResourcesScreen} />
    <Stack.Screen name="TermsPolicyScreen" component={TermsPolicyScreen} />
    <Stack.Screen name="ReferAndEarnScreen" component={ReferAndEarnScreen} />
    <Stack.Screen name="TripHistoryScreen" component={TripHistoryScreen} />
    <Stack.Screen name="MyVehicleScreen" component={MyVehicleScreen} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
</Stack.Navigator>
);

export default MainNavigator;
