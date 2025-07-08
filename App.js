import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './frontend/context/AuthProvider';
import SplashScreen from './frontend/screens/SplashScreen';
import LoginScreen from './frontend/screens/LoginScreen';
import SignupScreen from './frontend/screens/SignupScreen';
import OTPScreen from './frontend/screens/OTPScreen';
import DriverApplicationScreen from './frontend/screens/ApplicationFormScreen';
import MainNavigator from './frontend/navigation/MainNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { authToken, loading } = useContext(AuthContext);
  if (loading) return <SplashScreen />;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authToken ? (
        <Stack.Screen name="MainNavigator" component={MainNavigator} />
      ) : (
        <>
          <Stack.Screen name="SignupScreen" component={SignupScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="OTPScreen" component={OTPScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}