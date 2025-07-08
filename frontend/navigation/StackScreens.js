
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EarningsScreen from '../screens/EarningsScreen';

const Stack = createStackNavigator();

export default function StackScreens() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
    </Stack.Navigator>
  );
}
