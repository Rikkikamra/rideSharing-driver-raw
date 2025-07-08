
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import HornLoading from '../components/HornLoading';
import { useAuth } from '../context/AuthContext';

export default function AuthLoadingScreen({ navigation }) {
  const { checkToken } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      const valid = await checkToken();
      navigation.replace(valid ? 'MainApp' : 'Login');
    };
    initialize();
  }, []);

  return (
    <View style={styles.container}>
      <HornLoading />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
