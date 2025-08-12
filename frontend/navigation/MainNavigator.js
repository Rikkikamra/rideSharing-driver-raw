// frontend/navigation/MainNavigator.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LetsDriveScreen           from '../screens/LetsDriveScreen';
import EarningsScreen            from '../screens/EarningsScreen';
import TripsScreen               from '../screens/TripsScreen';
import AccountScreen             from '../screens/AccountScreen';
import EditProfileScreen         from '../screens/EditProfileScreen';
// … any other existing imports …

// New onboarding screens
import ApplicationInReviewScreen   from '../screens/ApplicationInReviewScreen';
import ApplicationApprovedScreen   from '../screens/ApplicationApprovedScreen';
import ApplicationRejectedScreen   from '../screens/ApplicationRejectedScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* Core app screens */}
    <Stack.Screen
      name="LetsDrive"
      component={LetsDriveScreen}
    />
    <Stack.Screen
      name="Earnings"
      component={EarningsScreen}
    />
    <Stack.Screen
      name="Trips"
      component={TripsScreen}
    />
    <Stack.Screen
      name="AccountScreen"
      component={AccountScreen}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
    />

    {/* Driver onboarding flow */}
    <Stack.Screen
      name="ApplicationInReview"
      component={ApplicationInReviewScreen}
    />
    <Stack.Screen
      name="ApplicationApproved"
      component={ApplicationApprovedScreen}
    />
    <Stack.Screen
      name="ApplicationRejected"
      component={ApplicationRejectedScreen}
    />
  </Stack.Navigator>
);

export default MainNavigator;
