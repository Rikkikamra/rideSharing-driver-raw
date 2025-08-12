// frontend/App.js
import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthProvider';
import { RideTypesProvider } from './context/RideTypesContext';
import TabNavigation from './navigation/TabNavigation';
import ApplicationInReviewScreen from './screens/ApplicationInReviewScreen';
import ApplicationApprovedScreen from './screens/ApplicationApprovedScreen';
import ApplicationRejectedScreen from './screens/ApplicationRejectedScreen';

const RootStack = createNativeStackNavigator();

function AppNavigation() {
  const { colors } = useTheme();

  // Navigation theme built ONLY from your tokens
  const navTheme = useMemo(
    () => ({
      dark: false,
      colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        border: colors.border,
        notification: colors.accent,
      },
    }),
    [colors]
  );

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator initialRouteName="MainApp" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="ApplicationInReview" component={ApplicationInReviewScreen} />
        <RootStack.Screen name="ApplicationApproved" component={ApplicationApprovedScreen} />
        <RootStack.Screen name="ApplicationRejected" component={ApplicationRejectedScreen} />
        <RootStack.Screen name="MainApp" component={TabNavigation} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <RideTypesProvider>
            <AppNavigation />
          </RideTypesProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
