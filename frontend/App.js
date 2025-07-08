// frontend/App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import TabNavigation from './navigation/TabNavigation';
import { AuthProvider } from './context/AuthProvider';
// import { ThemeProvider } from './context/ThemeContext';
import { Appearance } from 'react-native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const App = () => {
  const colorScheme = Appearance.getColorScheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BF5700" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <ThemeProvider> */}
        <AuthProvider>
          <TabNavigation />
        </AuthProvider>
      {/* </ThemeProvider> */}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
});
